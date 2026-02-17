// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Input,
//   Button,
//   Table,
//   Tag,
//   DatePicker,
//   Typography,
//   Select,
//   Space,
//   Alert,
//   Spin,
// } from 'antd';
// import { FileTextOutlined, SyncOutlined, DownloadOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import reportsAPI from '../api/reports';
// import adminAPI from '../api/admin';

// const { Title } = Typography;
// const { Option } = Select;

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [subject, setSubject] = useState('');
//   const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [fetchingSubjects, setFetchingSubjects] = useState(false);

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       setFetchingSubjects(true);
//       const students = await adminAPI.getStudents();
//       const allSubjects = [...new Set(
//         students.flatMap(student => student.subjects || [])
//       )];
//       setSubjects(allSubjects);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     } finally {
//       setFetchingSubjects(false);
//     }
//   };

//   const fetchReport = async () => {
//     if (!subject) {
//       Alert.warning('Please select a subject');
//       return;
//     }

//     setLoading(true);
//     try {
//       const reportData = await reportsAPI.getAttendanceReport(subject, date);
//       setData(reportData);
//     } catch (error) {
//       console.error('Error fetching report:', error);
//       Alert.error('Failed to fetch attendance report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToCSV = () => {
//     if (data.length === 0) {
//       Alert.warning('No data to export');
//       return;
//     }

//     const headers = ['Student ID', 'Name', 'Status', 'Detected At', 'Subject', 'Date'];
//     const csvRows = [
//       headers.join(','),
//       ...data.map(item =>
//         [
//           `"${item.student_id}"`,
//           `"${item.full_name}"`,
//           `"${item.status}"`,
//           `"${item.first_detected_at ? new Date(item.first_detected_at).toLocaleString() : ''}"`,
//           `"${subject}"`,
//           `"${date}"`
//         ].join(',')
//       )
//     ];

//     const csvContent = csvRows.join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `attendance_${subject}_${date}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const columns = [
//     {
//       title: 'Student ID',
//       dataIndex: 'student_id',
//       width: 120,
//     },
//     {
//       title: 'Name',
//       dataIndex: 'full_name',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: (status) => (
//         <Tag color={status === 'PRESENT' ? 'green' : 'red'}>
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Detected At',
//       dataIndex: 'first_detected_at',
//       render: (value) => (
//         <span className="font-mono text-blue-600">
//           {value ? dayjs(value).format('HH:mm:ss') : 'N/A'}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Title level={3}>Attendance Reports</Title>

//       <Card className="mb-6 shadow-sm">
//         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//           <div className="flex flex-wrap gap-4">
//             <Select
//               style={{ width: 200 }}
//               placeholder="Select Subject"
//               value={subject}
//               onChange={setSubject}
//               loading={fetchingSubjects}
//               allowClear
//             >
//               {subjects.map((subj) => (
//                 <Option key={subj} value={subj}>
//                   {subj}
//                 </Option>
//               ))}
//             </Select>

//             <DatePicker
//               style={{ width: 200 }}
//               onChange={(date, dateString) => setDate(dateString)}
//               defaultValue={dayjs()}
//               format="YYYY-MM-DD"
//             />

//             <Button
//               type="primary"
//               onClick={fetchReport}
//               loading={loading}
//               icon={<SyncOutlined />}
//             >
//               Generate Report
//             </Button>

//             {data.length > 0 && (
//               <Button
//                 type="default"
//                 onClick={exportToCSV}
//                 icon={<DownloadOutlined />}
//               >
//                 Export CSV
//               </Button>
//             )}
//           </div>

//           <Alert
//             message="Instructions"
//             description="Select a subject and date to generate attendance report. Click Export CSV to download the report."
//             type="info"
//             showIcon
//           />
//         </Space>
//       </Card>

//       <Table
//         loading={loading}
//         dataSource={data}
//         columns={columns}
//         rowKey={(record, index) => `${record.student_id}_${index}`}
//         pagination={{ pageSize: 10 }}
//         className="shadow-sm"
//         locale={{
//           emptyText: subject
//             ? 'No attendance records found for the selected criteria'
//             : 'Select a subject and click Generate Report',
//         }}
//         summary={(pageData) => {
//           const total = pageData.length;
//           const present = pageData.filter((item) => item.status === 'PRESENT').length;
//           const absent = total - present;

//           return (
//             <Table.Summary>
//               <Table.Summary.Row>
//                 <Table.Summary.Cell index={0} colSpan={2}>
//                   <strong>Summary</strong>
//                 </Table.Summary.Cell>
//                 <Table.Summary.Cell index={2}>
//                   <Tag color="green">Present: {present}</Tag>
//                   <Tag color="red" className="ml-2">
//                     Absent: {absent}
//                   </Tag>
//                 </Table.Summary.Cell>
//                 <Table.Summary.Cell index={3}>
//                   <strong>Total: {total}</strong>
//                 </Table.Summary.Cell>
//               </Table.Summary.Row>
//             </Table.Summary>
//           );
//         }}
//       />
//     </div>
//   );
// };

// export default Reports;



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
// } from 'antd';
// import { SyncOutlined, DownloadOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import reportsAPI from '../api/reports';
// import adminAPI from '../api/admin';

// const { Title } = Typography;
// const { Option } = Select;

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [fetchingSubjects, setFetchingSubjects] = useState(false);

//   // -------------------------------
//   // Fetch subjects from students
//   // -------------------------------
//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       setFetchingSubjects(true);
//       const students = await adminAPI.getStudents();

//       const uniqueSubjects = [
//         ...new Set(
//           students.flatMap(student => student.subjects || [])
//         ),
//       ];

//       setSubjects(uniqueSubjects);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       message.error('Failed to load subjects');
//     } finally {
//       setFetchingSubjects(false);
//     }
//   };

//   // -------------------------------
//   // Generate Attendance Report
//   // -------------------------------
//   const fetchReport = async () => {
//     if (!subject) {
//       message.warning('Please select a subject');
//       return;
//     }

//     setLoading(true);
//     try {
//       // 1️⃣ Fetch all students
//       const students = await adminAPI.getStudents();

//       // 2️⃣ Filter students registered for selected subject
//       const subjectStudents = students.filter(student =>
//         (student.subjects || []).includes(subject)
//       );

//       // 3️⃣ Fetch attendance (PRESENT students only)
//       const presentRecords = await reportsAPI.getAttendanceReport(subject, date);

//       // 4️⃣ Create lookup map
//       const presentMap = {};
//       presentRecords.forEach(record => {
//         presentMap[record.student_id] = record;
//       });

//       // 5️⃣ Merge → add ABSENT students
//       const mergedReport = subjectStudents.map(student => {
//         const present = presentMap[student.student_id];

//         return {
//           student_id: student.student_id,
//           full_name: student.full_name,
//           status: present ? 'PRESENT' : 'ABSENT',
//           first_detected_at: present?.first_detected_at || null,
//         };
//       });

//       setData(mergedReport);
//     } catch (error) {
//       console.error('Error generating report:', error);
//       message.error('Failed to generate attendance report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------
//   // Export CSV
//   // -------------------------------
//   const exportToCSV = () => {
//     if (data.length === 0) {
//       message.warning('No data to export');
//       return;
//     }

//     const headers = [
//       'Student ID',
//       'Name',
//       'Status',
//       'Detected At',
//       'Subject',
//       'Date',
//     ];

//     const csvRows = [
//       headers.join(','),
//       ...data.map(item =>
//         [
//           `"${item.student_id}"`,
//           `"${item.full_name}"`,
//           `"${item.status}"`,
//           `"${item.first_detected_at ? dayjs(item.first_detected_at).format('HH:mm:ss') : ''}"`,
//           `"${subject}"`,
//           `"${date}"`,
//         ].join(',')
//       ),
//     ];

//     const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `attendance_${subject}_${date}.csv`;
//     a.click();

//     window.URL.revokeObjectURL(url);
//   };

//   // -------------------------------
//   // Table Columns
//   // -------------------------------
//   const columns = [
//     {
//       title: 'Student ID',
//       dataIndex: 'student_id',
//       width: 130,
//     },
//     {
//       title: 'Name',
//       dataIndex: 'full_name',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: status => (
//         <Tag color={status === 'PRESENT' ? 'green' : 'red'}>
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Detected At',
//       dataIndex: 'first_detected_at',
//       render: value =>
//         value ? (
//           <span className="font-mono text-blue-600">
//             {dayjs(value).format('HH:mm:ss')}
//           </span>
//         ) : (
//           '—'
//         ),
//     },
//   ];

//   // -------------------------------
//   // UI
//   // -------------------------------
//   return (
//     <div>
//       <Title level={3}>Attendance Reports</Title>

//       <Card className="mb-6 shadow-sm">
//         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//           <div className="flex flex-wrap gap-4">
//             <Select
//               style={{ width: 220 }}
//               placeholder="Select Subject"
//               value={subject}
//               onChange={setSubject}
//               loading={fetchingSubjects}
//               allowClear
//             >
//               {subjects.map(subj => (
//                 <Option key={subj} value={subj}>
//                   {subj}
//                 </Option>
//               ))}
//             </Select>

//             <DatePicker
//               style={{ width: 200 }}
//               value={dayjs(date)}
//               onChange={(d, ds) => setDate(ds)}
//               format="YYYY-MM-DD"
//             />

//             <Button
//               type="primary"
//               icon={<SyncOutlined />}
//               loading={loading}
//               onClick={fetchReport}
//             >
//               Generate Report
//             </Button>

//             {data.length > 0 && (
//               <Button
//                 icon={<DownloadOutlined />}
//                 onClick={exportToCSV}
//               >
//                 Export CSV
//               </Button>
//             )}
//           </div>

//           <Alert
//             message="Instructions"
//             description="Select a subject and date to generate attendance report. Students not detected will be marked as ABSENT."
//             type="info"
//             showIcon
//           />
//         </Space>
//       </Card>

//       <Table
//         dataSource={data}
//         columns={columns}
//         rowKey="student_id"
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//         locale={{
//           emptyText: subject
//             ? 'No students found for this subject'
//             : 'Select a subject and generate report',
//         }}
//         summary={pageData => {
//           const total = pageData.length;
//           const present = pageData.filter(i => i.status === 'PRESENT').length;
//           const absent = total - present;

//           return (
//             <Table.Summary>
//               <Table.Summary.Row>
//                 <Table.Summary.Cell colSpan={2}>
//                   <strong>Summary</strong>
//                 </Table.Summary.Cell>
//                 <Table.Summary.Cell>
//                   <Tag color="green">Present: {present}</Tag>
//                   <Tag color="red" className="ml-2">
//                     Absent: {absent}
//                   </Tag>
//                 </Table.Summary.Cell>
//                 <Table.Summary.Cell>
//                   <strong>Total: {total}</strong>
//                 </Table.Summary.Cell>
//               </Table.Summary.Row>
//             </Table.Summary>
//           );
//         }}
//       />
//     </div>
//   );
// };

// export default Reports;




// second one with pdf below code 

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
// } from 'antd';
// import { SyncOutlined, DownloadOutlined } from '@ant-design/icons';
// // import dayjs from 'dayjs';

// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';

// dayjs.extend(utc);


// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';


// import reportsAPI from '../api/reports';
// import adminAPI from '../api/admin';

// const { Title } = Typography;
// const { Option } = Select;

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [fetchingSubjects, setFetchingSubjects] = useState(false);

//   // --------------------------------
//   // Fetch Subjects
//   // --------------------------------
//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       setFetchingSubjects(true);
//       const students = await adminAPI.getStudents();

//       const uniqueSubjects = [
//         ...new Set(
//           students.flatMap(student => student.subjects || [])
//         ),
//       ];

//       setSubjects(uniqueSubjects);
//     } catch (error) {
//       console.error(error);
//       message.error('Failed to load subjects');
//     } finally {
//       setFetchingSubjects(false);
//     }
//   };

//   // --------------------------------
//   // Generate Attendance Report
//   // --------------------------------
//   const fetchReport = async () => {
//     if (!subject) {
//       message.warning('Please select a subject');
//       return;
//     }

//     setLoading(true);
//     try {
//       const students = await adminAPI.getStudents();

//       const subjectStudents = students.filter(student =>
//         (student.subjects || []).includes(subject)
//       );

//       const presentRecords = await reportsAPI.getAttendanceReport(
//         subject,
//         date
//       );

//       const presentMap = {};
//       presentRecords.forEach(record => {
//         presentMap[record.student_id] = record;
//       });

//       const mergedReport = subjectStudents.map(student => {
//         const present = presentMap[student.student_id];

//         return {
//           student_id: student.student_id,
//           full_name: student.full_name,
//           status: present ? 'PRESENT' : 'ABSENT',
//           first_detected_at: present?.first_detected_at || null,
//         };
//       });

//       setData(mergedReport);
//     } catch (error) {
//       console.error(error);
//       message.error('Failed to generate attendance report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------
//   // Export CSV
//   // --------------------------------
//   const exportToCSV = () => {
//     if (data.length === 0) {
//       message.warning('No data to export');
//       return;
//     }

//     const headers = [
//       'Student ID',
//       'Student Name',
//       'Detected At',
//       'Status',
//       'Subject',
//       'Date',
//     ];

//     const rows = [
//       headers.join(','),
//       ...data.map(item =>
//         [
//           `"${item.student_id}"`,
//           `"${item.full_name}"`,
//           `"${item.first_detected_at
//             ? dayjs(item.first_detected_at).format('HH:mm:ss')
//             : ''}"`,
//           `"${item.status}"`,
//           `"${subject}"`,
//           `"${date}"`,
//         ].join(',')
//       ),
//     ];

//     const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `attendance_${subject}_${date}.csv`;
//     a.click();

//     window.URL.revokeObjectURL(url);
//   };

//   // --------------------------------
//   // Export PDF (Official Attendance Sheet)
//   // --------------------------------
//   const exportToPDF = () => {
//   if (data.length === 0) {
//     message.warning('No data to export');
//     return;
//   }

//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(16);
//   doc.text('Lincoln University College, Malaysia', 105, 15, { align: 'center' });

//   // Subject & Date
//   doc.setFontSize(11);
//   doc.text(`Subject Name : ${subject}`, 14, 30);
//   doc.text(`Date : ${date}`, 150, 30);

//   // Table
//   autoTable(doc, {
//     startY: 40,
//     theme: 'grid',
//     head: [[
//       'Student Name',
//       'Student ID',
//       'Detected At',
//       'Status',
//     ]],
//     body: data.map(item => [
//       item.full_name,
//       item.student_id,
//       item.first_detected_at
//         ? dayjs(item.first_detected_at).format('HH:mm:ss')
//         : '—',
//       item.status,
//     ]),
//     styles: {
//       fontSize: 10,
//       cellPadding: 3,
//     },
//     headStyles: {
//       fillColor: [22, 119, 255],
//       textColor: 255,
//     },
//     columnStyles: {
//       0: { cellWidth: 60 },
//       1: { cellWidth: 35 },
//       2: { cellWidth: 35 },
//       3: { cellWidth: 30 },
//     },
//   });

//   // Footer
//   const pageHeight = doc.internal.pageSize.height;
//   doc.setFontSize(9);
//   doc.text(
//     'Generated by Attendance Management System',
//     105,
//     pageHeight - 10,
//     { align: 'center' }
//   );

//   doc.save(`attendance_${subject}_${date}.pdf`);
// };

//   // --------------------------------
//   // Table Columns
//   // --------------------------------
//   const columns = [
//     {
//       title: 'Student ID',
//       dataIndex: 'student_id',
//       width: 120,
//     },
//     {
//       title: 'Student Name',
//       dataIndex: 'full_name',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: status => (
//         <Tag color={status === 'PRESENT' ? 'green' : 'red'}>
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Detected At',
//       dataIndex: 'first_detected_at',
//       render: value =>
//         value ? dayjs(value).format('HH:mm:ss') : '—',
//     },
//   ];

//   // --------------------------------
//   // UI
//   // --------------------------------
//   return (
//     <div>
//       <Title level={3}>Attendance Reports</Title>

//       <Card className="mb-6">
//         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//           <div className="flex flex-wrap gap-4">
//             <Select
//               style={{ width: 220 }}
//               placeholder="Select Subject"
//               value={subject}
//               onChange={setSubject}
//               loading={fetchingSubjects}
//               allowClear
//             >
//               {subjects.map(subj => (
//                 <Option key={subj} value={subj}>
//                   {subj}
//                 </Option>
//               ))}
//             </Select>

//             <DatePicker
//               style={{ width: 200 }}
//               value={dayjs(date)}
//               onChange={(d, ds) => setDate(ds)}
//               format="YYYY-MM-DD"
//             />

//             <Button
//               type="primary"
//               icon={<SyncOutlined />}
//               loading={loading}
//               onClick={fetchReport}
//             >
//               Generate Report
//             </Button>

//             {data.length > 0 && (
//               <>
//                 <Button icon={<DownloadOutlined />} onClick={exportToCSV}>
//                   Export CSV
//                 </Button>

//                 <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
//                   Export PDF
//                 </Button>
//               </>
//             )}
//           </div>

//           <Alert
//             type="info"
//             showIcon
//             message="Instructions"
//             description="Select a subject and date to generate the attendance report. Undetected students are marked as ABSENT."
//           />
//         </Space>
//       </Card>

//       <Table
//         rowKey="student_id"
//         dataSource={data}
//         columns={columns}
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//         locale={{
//           emptyText: subject
//             ? 'No students found for this subject'
//             : 'Select subject and generate report',
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
  // Fetch Subjects
  // --------------------------------
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setFetchingSubjects(true);
      const students = await adminAPI.getStudents();

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
  // Generate Attendance Report
  // --------------------------------
  const fetchReport = async () => {
    if (!subject) {
      message.warning('Please select a subject');
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Fetch all students
      const students = await adminAPI.getStudents();

      // 2️⃣ Filter students for selected subject
      const subjectStudents = students.filter(student =>
        (student.subjects || []).includes(subject)
      );

      // 3️⃣ Fetch present attendance records
      const presentRecords = await reportsAPI.getAttendanceReport(
        subject,
        date
      );

      // 4️⃣ Create lookup map
      const presentMap = {};
      presentRecords.forEach(record => {
        presentMap[record.student_id] = record;
      });

      // 5️⃣ Merge → PRESENT / ABSENT
      const mergedReport = subjectStudents.map(student => {
        const present = presentMap[student.student_id];

        return {
          student_id: student.student_id,
          full_name: student.full_name,
          status: present ? 'PRESENT' : 'ABSENT',
          first_detected_at: present?.first_detected_at || null,
        };
      });

      setData(mergedReport);
    } catch (error) {
      console.error(error);
      message.error('Failed to generate attendance report');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Export CSV
  // --------------------------------
  // const exportToCSV = () => {
  //   if (data.length === 0) {
  //     message.warning('No data to export');
  //     return;
  //   }

  //   const headers = [
  //     'Student ID',
  //     'Student Name',
  //     'Detected At',
  //     'Status',
  //     'Subject',
  //     'Date',
  //   ];

  //   const rows = [
  //     headers.join(','),
  //     ...data.map(item =>
  //       [
  //         `"${item.student_id}"`,
  //         `"${item.full_name}"`,
  //         `"${item.first_detected_at
  //           ? dayjs.utc(item.first_detected_at).local().format('HH:mm:ss')
  //           : ''}"`,
  //         `"${item.status}"`,
  //         `"${subject}"`,
  //         `"${date}"`,
  //       ].join(',')
  //     ),
  //   ];

  //   const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);

  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `attendance_${subject}_${date}.csv`;
  //   a.click();

  //   window.URL.revokeObjectURL(url);
  // };

  

  // --------------------------------
  // Export PDF
  // --------------------------------
  // const exportToPDF = () => {
  //   if (data.length === 0) {
  //     message.warning('No data to export');
  //     return;
  //   }

  //   const doc = new jsPDF();

  //   doc.setFontSize(16);
  //   doc.text(
  //     'Lincoln University College, Malaysia',
  //     105,
  //     15,
  //     { align: 'center' }
  //   );

  //   doc.setFontSize(11);
  //   doc.text(`Subject : ${subject}`, 14, 30);
  //   doc.text(`Date : ${date}`, 150, 30);

  //   autoTable(doc, {
  //     startY: 40,
  //     theme: 'grid',
  //     head: [[
  //       'Student Name',
  //       'Student ID',
  //       'Detected At',
  //       'Status',
  //     ]],
  //     body: data.map(item => [
  //       item.full_name,
  //       item.student_id,
  //       item.first_detected_at
  //         ? dayjs.utc(item.first_detected_at).local().format('HH:mm:ss')
  //         : '—',
  //       item.status,
  //     ]),
  //     styles: {
  //       fontSize: 10,
  //       cellPadding: 3,
  //     },
  //     headStyles: {
  //       fillColor: [22, 119, 255],
  //       textColor: 255,
  //     },
  //   });

  //   const pageHeight = doc.internal.pageSize.height;
  //   doc.setFontSize(9);
  //   doc.text(
  //     'Generated by Attendance Management System',
  //     105,
  //     pageHeight - 10,
  //     { align: 'center' }
  //   );

  //   doc.save(`attendance_${subject}_${date}.pdf`);
  // };



  // --------------------------------
// Export PDF
// --------------------------------
const exportToPDF = () => {
  if (data.length === 0) {
    message.warning('No data to export');
    return;
  }

  const doc = new jsPDF();

  // -----------------------------
  // Header
  // -----------------------------
  doc.setFontSize(16);
  doc.text(
    'Lincoln University College, Malaysia',
    105,
    15,
    { align: 'center' }
  );

  doc.setFontSize(11);
  doc.text(`Subject : ${subject}`, 14, 30);
  doc.text(`Date : ${date}`, 150, 30);

  // -----------------------------
  // Attendance Table
  // -----------------------------
  autoTable(doc, {
    startY: 40,
    theme: 'grid',
    head: [[
      'Student Name',
      'Student ID',
      'Detected At',
      'Status',
    ]],
    body: data.map(item => [
      item.full_name,
      item.student_id,
      item.first_detected_at
        ? dayjs.utc(item.first_detected_at).local().format('HH:mm:ss')
        : '—',
      item.status,
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 119, 255],
      textColor: 255,
    },
  });

  // -----------------------------
  // Footer: Instructor Signature + Generated By
  // -----------------------------
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20; // space from bottom

  // Horizontal line for signature (bottom left)
  const lineStartX = 14;
  const lineEndX = 65;
  const lineY = pageHeight - marginBottom;
  doc.setLineWidth(0.5);
  doc.line(lineStartX, lineY, lineEndX, lineY);

  // Signature text below the line
  doc.setFontSize(10);
  doc.text('Instructor Signature', lineStartX, lineY + 6);

  // "Generated by" text (centered above bottom margin)
  doc.setFontSize(9);
  doc.text(
    'Generated by Lincoln Attendance Management System',
    105,
    pageHeight - 10,
    { align: 'center' }
  );

  // -----------------------------
  // Save PDF
  // -----------------------------
  doc.save(`attendance_${subject}_${date}.pdf`);
};


  // --------------------------------
  // Table Columns
  // --------------------------------
  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      width: 120,
    },
    {
      title: 'Student Name',
      dataIndex: 'full_name',
    },
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
        value
          ? dayjs.utc(value).local().format('HH:mm:ss')
          : '—',
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
                <Option key={subj} value={subj}>
                  {subj}
                </Option>
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
              <>
                {/* <Button icon={<DownloadOutlined />} onClick={exportToCSV}>
                  Export CSV
                </Button> */}
                <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
                  Export PDF
                </Button>
              </>
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
        summary={pageData => {
          const total = pageData.length;
          const present = pageData.filter(i => i.status === 'PRESENT').length;
          const absent = total - present;

          return (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>
                  <strong>Summary</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Tag color="green">Present: {present}</Tag>
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    Absent: {absent}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <strong>Total: {total}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default Reports;
