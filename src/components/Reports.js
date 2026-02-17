
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Button,
//   Table,
//   Tag,
//   DatePicker,
//   Typography,
//   Select,
//   Space,
//   Alert,
//   message,
//   Divider,
//   Row,
//   Col,
//   Statistic
// } from 'antd';
// import { 
//   SyncOutlined, 
//   DownloadOutlined, 
//   FilePdfOutlined, 
//   FileTextOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   TeamOutlined
// } from '@ant-design/icons';

// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// dayjs.extend(utc);

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// import reportsAPI from '../api/reports';
// import adminAPI from '../api/admin';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [fetchingSubjects, setFetchingSubjects] = useState(false);
//   const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });

//   // --------------------------------
//   // Fetch Subjects
//   // --------------------------------
//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       setFetchingSubjects(true);
//       const students = await adminAPI.getStudents() || [];
//       const uniqueSubjects = [
//         ...new Set(students.flatMap(s => s.subjects || [])),
//       ];
//       setSubjects(uniqueSubjects);
//     } catch (error) {
//       console.error('Error loading subjects:', error);
//       message.error('System could not load subject list');
//     } finally {
//       setFetchingSubjects(false);
//     }
//   };

//   // --------------------------------
//   // Generate Attendance Report
//   // --------------------------------
//   const fetchReport = async () => {
//     if (!subject) {
//       message.warning('Please select a subject first');
//       return;
//     }

//     setLoading(true);
//     try {
//       // 1. Fetch all students and present records in parallel
//       const [studentsResponse, presentRecordsResponse] = await Promise.all([
//         adminAPI.getStudents(),
//         reportsAPI.getAttendanceReport(subject, date)
//       ]);

//       const students = studentsResponse || [];
//       const presentRecords = Array.isArray(presentRecordsResponse) ? presentRecordsResponse : [];

//       // 2. Filter students registered for the selected subject
//       const subjectStudents = students.filter(student =>
//         (student.subjects || []).includes(subject)
//       );

//       // 3. Create a lookup map for present students
//       const presentMap = {};
//       presentRecords.forEach(record => {
//         if (record && record.student_id) {
//           presentMap[record.student_id] = record;
//         }
//       });

//       // 4. Merge to create the final report (PRESENT vs ABSENT)
//       const mergedReport = subjectStudents.map(student => {
//         const attendance = presentMap[student.student_id];
//         return {
//           key: student.student_id,
//           student_id: student.student_id,
//           full_name: student.full_name,
//           status: attendance ? 'PRESENT' : 'ABSENT',
//           first_detected_at: attendance?.first_detected_at || null,
//         };
//       });

//       // 5. Update state
//       setData(mergedReport);
      
//       const presentCount = mergedReport.filter(r => r.status === 'PRESENT').length;
//       setSummary({
//         total: mergedReport.length,
//         present: presentCount,
//         absent: mergedReport.length - presentCount
//       });

//       if (mergedReport.length === 0) {
//         message.info('No students are currently enrolled in this subject');
//       } else {
//         message.success(`Report generated: ${mergedReport.length} students processed`);
//       }
//     } catch (error) {
//       console.error('Report Generation Error:', error);
//       message.error('Unable to generate report. Please verify API connectivity.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------
//   // Export PDF (Professional University Format)
//   // --------------------------------
//   const exportToPDF = () => {
//     if (data.length === 0) {
//       message.warning('No data available to export');
//       return;
//     }

//     const doc = new jsPDF();
//     const timestamp = dayjs().format('DD/MM/YYYY HH:mm');

//     // Header Branding
//     doc.setFontSize(18);
//     doc.setTextColor(29, 78, 216); // Professional Blue
//     doc.text('LINCOLN UNIVERSITY COLLEGE', 105, 15, { align: 'center' });
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text('OFFICIAL ATTENDANCE RECORD', 105, 22, { align: 'center' });

//     doc.setDrawColor(200);
//     doc.line(14, 25, 196, 25);

//     // Report Metadata
//     doc.setFontSize(11);
//     doc.setTextColor(0);
//     doc.setFont(undefined, 'bold');
//     doc.text(`Subject: ${subject}`, 14, 35);
//     doc.text(`Date: ${dayjs(date).format('DD MMMM YYYY')}`, 14, 42);
    
//     doc.setFont(undefined, 'normal');
//     doc.text(`Report Generated: ${timestamp}`, 196, 35, { align: 'right' });
//     doc.text(`Attendance Rate: ${((summary.present / summary.total) * 100).toFixed(1)}%`, 196, 42, { align: 'right' });

//     // Table
//     autoTable(doc, {
//       startY: 50,
//       theme: 'grid',
//       head: [[
//         '#',
//         'Student Name',
//         'Student ID',
//         'Status',
//         'Time Detected'
//       ]],
//       body: data.map((item, index) => [
//         index + 1,
//         item.full_name,
//         item.student_id,
//         item.status,
//         item.first_detected_at
//           ? dayjs.utc(item.first_detected_at).local().format('hh:mm:ss A')
//           : '—'
//       ]),
//       headStyles: {
//         fillColor: [29, 78, 216],
//         textColor: 255,
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: {
//         fillColor: [248, 250, 252]
//       },
//       didParseCell: (data) => {
//         if (data.column.index === 3) {
//           if (data.cell.text[0] === 'PRESENT') {
//             data.cell.styles.textColor = [22, 163, 74]; // Green
//           } else {
//             data.cell.styles.textColor = [220, 38, 38]; // Red
//           }
//         }
//       }
//     });

//     // Summary Section
//     const finalY = doc.lastAutoTable.finalY + 15;
//     doc.setFontSize(11);
//     doc.setFont(undefined, 'bold');
//     doc.text('Session Summary:', 14, finalY);
//     doc.setFont(undefined, 'normal');
//     doc.text(`Total Enrolled: ${summary.total} | Present: ${summary.present} | Absent: ${summary.absent}`, 14, finalY + 7);

//     // Signatures
//     const pageHeight = doc.internal.pageSize.height;
//     doc.setDrawColor(0);
//     doc.line(14, pageHeight - 30, 70, pageHeight - 30);
//     doc.text('Instructor Signature', 14, pageHeight - 24);

//     doc.line(140, pageHeight - 30, 196, pageHeight - 30);
//     doc.text('Registrar / Faculty Office', 140, pageHeight - 24);

//     doc.setFontSize(8);
//     doc.setTextColor(150);
//     doc.text('This is a computer-generated document. No manual alteration is permitted.', 105, pageHeight - 10, { align: 'center' });

//     doc.save(`Attendance_Report_${subject}_${date}.pdf`);
//     message.success('PDF Report downloaded successfully');
//   };

//   const columns = [
//     {
//       title: 'Student Detail',
//       key: 'student',
//       render: (record) => (
//         <Space>
//           <Avatar 
//             src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.full_name}&backgroundColor=1d4ed8`}
//             size="small"
//           />
//           <div>
//             <Text strong>{record.full_name}</Text>
//             <br />
//             <Text type="secondary" size="small">{record.student_id}</Text>
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag 
//           color={status === 'PRESENT' ? 'success' : 'error'}
//           icon={status === 'PRESENT' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
//           className="px-3 py-1 rounded-full font-bold"
//         >
//           {status}
//         </Tag>
//       ),
//       filters: [
//         { text: 'Present', value: 'PRESENT' },
//         { text: 'Absent', value: 'ABSENT' },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: 'Time Detected',
//       dataIndex: 'first_detected_at',
//       key: 'time',
//       render: (value) => (
//         value ? (
//           <Space>
//             <SyncOutlined className="text-blue-500" />
//             <Text className="font-mono">{dayjs.utc(value).local().format('hh:mm:ss A')}</Text>
//           </Space>
//         ) : (
//           <Text type="secondary">—</Text>
//         )
//       ),
//     },
//   ];

//   return (
//     <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
//       <div className="mb-6">
//         <Title level={2}>Attendance Intelligence Reports</Title>
//         <Text type="secondary">Generate, analyze, and export official student presence records.</Text>
//       </div>

//       <Card className="mb-8 shadow-sm border-0">
//         <Row gutter={[24, 24]} align="bottom">
//           <Col xs={24} md={8}>
//             <Text strong className="block mb-2">Select Subject</Text>
//             <Select
//               style={{ width: '100%' }}
//               size="large"
//               placeholder="Choose a subject"
//               value={subject}
//               onChange={setSubject}
//               loading={fetchingSubjects}
//               showSearch
//               allowClear
//             >
//               {subjects.map(subj => (
//                 <Option key={subj} value={subj}>{subj}</Option>
//               ))}
//             </Select>
//           </Col>
//           <Col xs={24} md={8}>
//             <Text strong className="block mb-2">Select Date</Text>
//             <DatePicker
//               style={{ width: '100%' }}
//               size="large"
//               value={dayjs(date)}
//               onChange={(d, ds) => setDate(ds)}
//               format="YYYY-MM-DD"
//               allowClear={false}
//             />
//           </Col>
//           <Col xs={24} md={8}>
//             <Space className="w-full">
//               <Button
//                 type="primary"
//                 size="large"
//                 icon={<SyncOutlined />}
//                 loading={loading}
//                 onClick={fetchReport}
//                 className="bg-blue-600 h-12 px-6"
//                 block
//               >
//                 Generate Report
//               </Button>
//               {data.length > 0 && (
//                 <Button
//                   size="large"
//                   icon={<FilePdfOutlined />}
//                   onClick={exportToPDF}
//                   className="h-12 border-red-200 text-red-600 hover:text-red-700 hover:border-red-300"
//                 >
//                   Export PDF
//                 </Button>
//               )}
//             </Space>
//           </Col>
//         </Row>
        
//         <Divider className="my-6" />
        
//         <Alert
//           message="System Intelligence"
//           description="The report merges live detection logs with the official registry. Students not recognized by the AI within the session window are automatically flagged as ABSENT."
//           type="info"
//           showIcon
//           className="rounded-lg"
//         />
//       </Card>

//       {data.length > 0 && (
//         <Row gutter={[24, 24]} className="mb-8">
//           <Col xs={24} sm={8}>
//             <Card className="text-center shadow-sm border-0 bg-blue-50">
//               <Statistic 
//                 title="Total Enrolled" 
//                 value={summary.total} 
//                 prefix={<TeamOutlined className="text-blue-500" />} 
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card className="text-center shadow-sm border-0 bg-green-50">
//               <Statistic 
//                 title="Present" 
//                 value={summary.present} 
//                 prefix={<CheckCircleOutlined className="text-green-500" />}
//                 valueStyle={{ color: '#16a34a' }}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card className="text-center shadow-sm border-0 bg-red-50">
//               <Statistic 
//                 title="Absent" 
//                 value={summary.absent} 
//                 prefix={<CloseCircleOutlined className="text-red-500" />}
//                 valueStyle={{ color: '#dc2626' }}
//               />
//             </Card>
//           </Col>
//         </Row>
//       )}

//       <Table
//         dataSource={data}
//         columns={columns}
//         loading={loading}
//         className="shadow-md rounded-xl overflow-hidden bg-white"
//         pagination={{ pageSize: 15, showSizeChanger: true }}
//         locale={{
//           emptyText: subject
//             ? 'No students found for this subject registry.'
//             : 'Select a subject and date above to pull intelligence records.',
//         }}
//       />
//     </div>
//   );
// };

// export default Reports;



// // below is second version it solve the data genrate report problems





// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Button,
//   Table,
//   Tag,
//   DatePicker,
//   Typography,
//   Select,
//   Space,
//   Alert,
//   message,
//   Divider,
//   Row,
//   Col,
//   Statistic
// } from 'antd';
// import { 
//   SyncOutlined, 
//   DownloadOutlined, 
//   FilePdfOutlined, 
//   FileTextOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   TeamOutlined
// } from '@ant-design/icons';

// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// dayjs.extend(utc);

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// import reportsAPI from '../api/reports';
// import adminAPI from '../api/admin';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [fetchingSubjects, setFetchingSubjects] = useState(false);
//   const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });

//   // --------------------------------
//   // Fetch Subjects
//   // --------------------------------
//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       setFetchingSubjects(true);
//       const students = await adminAPI.getStudents() || [];
//       const uniqueSubjects = [
//         ...new Set(students.flatMap(s => s.subjects || [])),
//       ];
//       setSubjects(uniqueSubjects);
//     } catch (error) {
//       console.error('Error loading subjects:', error);
//       message.error('System could not load subject list');
//     } finally {
//       setFetchingSubjects(false);
//     }
//   };

//   // --------------------------------
//   // Generate Attendance Report
//   // --------------------------------
//   const fetchReport = async () => {
//     if (!subject) {
//       message.warning('Please select a subject first');
//       return;
//     }

//     setLoading(true);
//     try {
//       // 1. Fetch all students and present records in parallel
//       const [studentsResponse, presentRecordsResponse] = await Promise.all([
//         adminAPI.getStudents(),
//         reportsAPI.getAttendanceReport(subject, date)
//       ]);

//       const students = studentsResponse || [];
//       const presentRecords = Array.isArray(presentRecordsResponse) ? presentRecordsResponse : [];

//       // 2. Filter students registered for the selected subject
//       const subjectStudents = students.filter(student =>
//         (student.subjects || []).includes(subject)
//       );

//       // 3. Create a lookup map for present students
//       const presentMap = {};
//       presentRecords.forEach(record => {
//         if (record && record.student_id) {
//           presentMap[record.student_id] = record;
//         }
//       });

//       // 4. Merge to create the final report (PRESENT vs ABSENT)
//       const mergedReport = subjectStudents.map(student => {
//         const attendance = presentMap[student.student_id];
//         return {
//           key: student.student_id,
//           student_id: student.student_id,
//           full_name: student.full_name,
//           status: attendance ? 'PRESENT' : 'ABSENT',
//           first_detected_at: attendance?.first_detected_at || null,
//         };
//       });

//       // 5. Update state
//       setData(mergedReport);
      
//       const presentCount = mergedReport.filter(r => r.status === 'PRESENT').length;
//       setSummary({
//         total: mergedReport.length,
//         present: presentCount,
//         absent: mergedReport.length - presentCount
//       });

//       if (mergedReport.length === 0) {
//         message.info('No students are currently enrolled in this subject');
//       } else {
//         message.success(`Report generated: ${mergedReport.length} students processed`);
//       }
//     } catch (error) {
//       console.error('Report Generation Error:', error);
//       message.error('Unable to generate report. Please verify API connectivity.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------
//   // Export PDF (Professional University Format)
//   // --------------------------------
//   const exportToPDF = () => {
//     if (data.length === 0) {
//       message.warning('No data available to export');
//       return;
//     }

//     const doc = new jsPDF();
//     const timestamp = dayjs().format('DD/MM/YYYY HH:mm');

//     // Header Branding
//     doc.setFontSize(18);
//     doc.setTextColor(29, 78, 216); // Professional Blue
//     doc.text('LINCOLN UNIVERSITY COLLEGE', 105, 15, { align: 'center' });
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text('OFFICIAL ATTENDANCE RECORD', 105, 22, { align: 'center' });

//     doc.setDrawColor(200);
//     doc.line(14, 25, 196, 25);

//     // Report Metadata
//     doc.setFontSize(11);
//     doc.setTextColor(0);
//     doc.setFont(undefined, 'bold');
//     doc.text(`Subject: ${subject}`, 14, 35);
//     doc.text(`Date: ${dayjs(date).format('DD MMMM YYYY')}`, 14, 42);
    
//     doc.setFont(undefined, 'normal');
//     doc.text(`Report Generated: ${timestamp}`, 196, 35, { align: 'right' });
//     doc.text(`Attendance Rate: ${((summary.present / summary.total) * 100).toFixed(1)}%`, 196, 42, { align: 'right' });

//     // Table
//     autoTable(doc, {
//       startY: 50,
//       theme: 'grid',
//       head: [[
//         '#',
//         'Student Name',
//         'Student ID',
//         'Status',
//         'Time Detected'
//       ]],
//       body: data.map((item, index) => [
//         index + 1,
//         item.full_name,
//         item.student_id,
//         item.status,
//         item.first_detected_at
//           ? dayjs.utc(item.first_detected_at).local().format('hh:mm:ss A')
//           : '—'
//       ]),
//       headStyles: {
//         fillColor: [29, 78, 216],
//         textColor: 255,
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: {
//         fillColor: [248, 250, 252]
//       },
//       didParseCell: (data) => {
//         if (data.column.index === 3) {
//           if (data.cell.text[0] === 'PRESENT') {
//             data.cell.styles.textColor = [22, 163, 74]; // Green
//           } else {
//             data.cell.styles.textColor = [220, 38, 38]; // Red
//           }
//         }
//       }
//     });

//     // Summary Section
//     const finalY = doc.lastAutoTable.finalY + 15;
//     doc.setFontSize(11);
//     doc.setFont(undefined, 'bold');
//     doc.text('Session Summary:', 14, finalY);
//     doc.setFont(undefined, 'normal');
//     doc.text(`Total Enrolled: ${summary.total} | Present: ${summary.present} | Absent: ${summary.absent}`, 14, finalY + 7);

//     // Signatures
//     const pageHeight = doc.internal.pageSize.height;
//     doc.setDrawColor(0);
//     doc.line(14, pageHeight - 30, 70, pageHeight - 30);
//     doc.text('Instructor Signature', 14, pageHeight - 24);

//     doc.line(140, pageHeight - 30, 196, pageHeight - 30);
//     doc.text('Registrar / Faculty Office', 140, pageHeight - 24);

//     doc.setFontSize(8);
//     doc.setTextColor(150);
//     doc.text('This is a computer-generated document. No manual alteration is permitted.', 105, pageHeight - 10, { align: 'center' });

//     doc.save(`Attendance_Report_${subject}_${date}.pdf`);
//     message.success('PDF Report downloaded successfully');
//   };

//   const columns = [
//     {
//       title: 'Student Detail',
//       key: 'student',
//       render: (record) => (
//         <Space>
//           <Avatar 
//             src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.full_name}&backgroundColor=1d4ed8`}
//             size="small"
//           />
//           <div>
//             <Text strong>{record.full_name}</Text>
//             <br />
//             <Text type="secondary" size="small">{record.student_id}</Text>
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag 
//           color={status === 'PRESENT' ? 'success' : 'error'}
//           icon={status === 'PRESENT' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
//           className="px-3 py-1 rounded-full font-bold"
//         >
//           {status}
//         </Tag>
//       ),
//       filters: [
//         { text: 'Present', value: 'PRESENT' },
//         { text: 'Absent', value: 'ABSENT' },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: 'Time Detected',
//       dataIndex: 'first_detected_at',
//       key: 'time',
//       render: (value) => (
//         value ? (
//           <Space>
//             <SyncOutlined className="text-blue-500" />
//             <Text className="font-mono">{dayjs.utc(value).local().format('hh:mm:ss A')}</Text>
//           </Space>
//         ) : (
//           <Text type="secondary">—</Text>
//         )
//       ),
//     },
//   ];

//   return (
//     <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
//       <div className="mb-6">
//         <Title level={2}>Attendance Intelligence Reports</Title>
//         <Text type="secondary">Generate, analyze, and export official student presence records.</Text>
//       </div>

//       <Card className="mb-8 shadow-sm border-0">
//         <Row gutter={[24, 24]} align="bottom">
//           <Col xs={24} md={8}>
//             <Text strong className="block mb-2">Select Subject</Text>
//             <Select
//               style={{ width: '100%' }}
//               size="large"
//               placeholder="Choose a subject"
//               value={subject}
//               onChange={setSubject}
//               loading={fetchingSubjects}
//               showSearch
//               allowClear
//             >
//               {subjects.map(subj => (
//                 <Option key={subj} value={subj}>{subj}</Option>
//               ))}
//             </Select>
//           </Col>
//           <Col xs={24} md={8}>
//             <Text strong className="block mb-2">Select Date</Text>
//             <DatePicker
//               style={{ width: '100%' }}
//               size="large"
//               value={dayjs(date)}
//               onChange={(d, ds) => setDate(ds)}
//               format="YYYY-MM-DD"
//               allowClear={false}
//             />
//           </Col>
//           <Col xs={24} md={8}>
//             <Space className="w-full">
//               <Button
//                 type="primary"
//                 size="large"
//                 icon={<SyncOutlined />}
//                 loading={loading}
//                 onClick={fetchReport}
//                 className="bg-blue-600 h-12 px-6"
//                 block
//               >
//                 Generate Report
//               </Button>
//               {data.length > 0 && (
//                 <Button
//                   size="large"
//                   icon={<FilePdfOutlined />}
//                   onClick={exportToPDF}
//                   className="h-12 border-red-200 text-red-600 hover:text-red-700 hover:border-red-300"
//                 >
//                   Export PDF
//                 </Button>
//               )}
//             </Space>
//           </Col>
//         </Row>
        
//         <Divider className="my-6" />
        
//         <Alert
//           message="System Intelligence"
//           description="The report merges live detection logs with the official registry. Students not recognized by the AI within the session window are automatically flagged as ABSENT."
//           type="info"
//           showIcon
//           className="rounded-lg"
//         />
//       </Card>

//       {data.length > 0 && (
//         <Row gutter={[24, 24]} className="mb-8">
//           <Col xs={24} sm={8}>
//             <Card className="text-center shadow-sm border-0 bg-blue-50">
//               <Statistic 
//                 title="Total Enrolled" 
//                 value={summary.total} 
//                 prefix={<TeamOutlined className="text-blue-500" />} 
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card className="text-center shadow-sm border-0 bg-green-50">
//               <Statistic 
//                 title="Present" 
//                 value={summary.present} 
//                 prefix={<CheckCircleOutlined className="text-green-500" />}
//                 valueStyle={{ color: '#16a34a' }}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card className="text-center shadow-sm border-0 bg-red-50">
//               <Statistic 
//                 title="Absent" 
//                 value={summary.absent} 
//                 prefix={<CloseCircleOutlined className="text-red-500" />}
//                 valueStyle={{ color: '#dc2626' }}
//               />
//             </Card>
//           </Col>
//         </Row>
//       )}

//       <Table
//         dataSource={data}
//         columns={columns}
//         loading={loading}
//         className="shadow-md rounded-xl overflow-hidden bg-white"
//         pagination={{ pageSize: 15, showSizeChanger: true }}
//         locale={{
//           emptyText: subject
//             ? 'No students found for this subject registry.'
//             : 'Select a subject and date above to pull intelligence records.',
//         }}
//       />
//     </div>
//   );
// };

// export default Reports;





import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  DatePicker,
  Typography,
  Select,
  Space,
  Alert,
  message,
} from 'antd';
import { SyncOutlined, DownloadOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import reportsAPI from '../api/reports';
import adminAPI from '../api/admin';

const { Title } = Typography;
const { Option } = Select;

const Reports = () => {
  const [data, setData] = useState([]);
  const [subject, setSubject] = useState(null);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  // --------------------------------
  // Fetch Subjects (SAFE)
  // --------------------------------
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setFetchingSubjects(true);

      const students = await adminAPI.getStudents() || [];

      const uniqueSubjects = [
        ...new Set(students.flatMap(s => s.subjects || [])),
      ];

      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error(error);
      message.error('Failed to load subjects');
    } finally {
      setFetchingSubjects(false);
    }
  };

  // --------------------------------
  // Generate Attendance Report (PRODUCTION SAFE)
  // --------------------------------
  const fetchReport = async () => {
    if (!subject) {
      message.warning('Please select a subject');
      return;
    }

    // 🔒 SNAPSHOT STATE (prevents stale React state bug)
    const selectedSubject = subject;
    const selectedDate = date;

    setLoading(true);

    try {
      // Parallel fetch
      const [studentsResponse, presentRecordsResponse] = await Promise.all([
        adminAPI.getStudents(),
        reportsAPI.getAttendanceReport(selectedSubject, selectedDate),
      ]);

      const students = studentsResponse || [];
      const presentRecords = Array.isArray(presentRecordsResponse)
        ? presentRecordsResponse
        : [];

      // Filter subject students
      const subjectStudents = students.filter(student =>
        (student.subjects || []).includes(selectedSubject)
      );

      // Build present lookup map (string-safe)
      const presentMap = {};
      presentRecords.forEach(record => {
        if (record && record.student_id !== undefined) {
          presentMap[String(record.student_id)] = record;
        }
      });

      // Merge PRESENT / ABSENT
      const mergedReport = subjectStudents.map(student => {
        const present = presentMap[String(student.student_id)];

        return {
          student_id: student.student_id,
          full_name: student.full_name,
          status: present ? 'PRESENT' : 'ABSENT',
          first_detected_at: present?.first_detected_at || null,
        };
      });

      setData(mergedReport);

      if (mergedReport.length === 0) {
        message.info('No students enrolled in this subject');
      } else {
        message.success(`Report generated (${mergedReport.length} students)`);
      }

    } catch (error) {
      console.error(error);
      message.error('Failed to generate attendance report');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Export PDF (Stable)
  // --------------------------------
  const exportToPDF = () => {
    if (data.length === 0) {
      message.warning('No data to export');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Lincoln University College, Malaysia', 105, 15, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Subject : ${subject}`, 14, 30);
    doc.text(`Date : ${date}`, 150, 30);

    autoTable(doc, {
      startY: 40,
      theme: 'grid',
      head: [['Student Name', 'Student ID', 'Detected At', 'Status']],
      body: data.map(item => [
        item.full_name,
        item.student_id,
        item.first_detected_at
          ? dayjs.utc(item.first_detected_at).local().format('HH:mm:ss')
          : '—',
        item.status,
      ]),
      headStyles: { fillColor: [22, 119, 255], textColor: 255 },
      styles: { fontSize: 10 },
    });

    const pageHeight = doc.internal.pageSize.height;

    doc.line(14, pageHeight - 20, 65, pageHeight - 20);
    doc.text('Instructor Signature', 14, pageHeight - 14);

    doc.setFontSize(9);
    doc.text(
      'Generated by Lincoln Attendance Management System',
      105,
      pageHeight - 5,
      { align: 'center' }
    );

    doc.save(`attendance_${subject}_${date}.pdf`);
  };

  // --------------------------------
  // Table Columns
  // --------------------------------
  const columns = [
    { title: 'Student ID', dataIndex: 'student_id', width: 120 },
    { title: 'Student Name', dataIndex: 'full_name' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <Tag color={status === 'PRESENT' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Detected At',
      dataIndex: 'first_detected_at',
      render: value =>
        value ? dayjs.utc(value).local().format('HH:mm:ss') : '—',
    },
  ];

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <div>
      <Title level={3}>Attendance Reports</Title>

      <Card className="mb-6">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="flex flex-wrap gap-4">

            <Select
              style={{ width: 220 }}
              placeholder="Select Subject"
              value={subject}
              onChange={setSubject}
              loading={fetchingSubjects}
              allowClear
            >
              {subjects.map(subj => (
                <Option key={subj} value={subj}>{subj}</Option>
              ))}
            </Select>

            <DatePicker
              style={{ width: 200 }}
              value={dayjs(date)}
              onChange={(d, ds) => setDate(ds)}
              format="YYYY-MM-DD"
            />

            <Button
              type="primary"
              icon={<SyncOutlined />}
              loading={loading}
              onClick={fetchReport}
            >
              Generate Report
            </Button>

            {data.length > 0 && (
              <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
                Export PDF
              </Button>
            )}
          </div>

          <Alert
            type="info"
            showIcon
            message="Instructions"
            description="Select a subject and date. Undetected students are marked as ABSENT."
          />
        </Space>
      </Card>

      <Table
        rowKey="student_id"
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Reports;
