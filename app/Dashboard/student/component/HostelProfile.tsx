// import React from "react";

// import {
//   CalendarDays,
//   MapPin,
//   Users,
//   Utensils,
//   Star,
//   MessageSquare,
// } from "lucide-react";
// import { Badge, Card, CardContent, CardHeader } from "@mui/material";

// const HostelProfile = ({ hostel }) => {
//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {hostel.name}
//           </CardContent>
//           <div className="flex items-center space-x-2">
//             <MapPin className="h-4 w-4 text-gray-500" />
//             <span className="text-sm text-gray-500">{hostel.address}</span>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center space-x-2">
//               <Users className="h-5 w-5 text-blue-500" />
//               <span>
//                 {hostel.beds} beds, {hostel.studentsPerRoom} per room
//               </span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Utensils className="h-5 w-5 text-green-500" />
//               <span>{hostel.food ? "Food provided" : "No food"}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Badge variant={hostel.hostelType === "girls" ? "pink" : "blue"}>
//                 {hostel.hostelType} hostel
//               </Badge>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Badge variant={hostel.verified ? "success" : "destructive"}>
//                 {hostel.verified ? "Verified" : "Unverified"}
//               </Badge>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Rent Structure</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <table className="w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-left py-2">Students per Room</th>
//                 <th className="text-left py-2">Rent per Student</th>
//               </tr>
//             </thead>
//             <tbody>
//               {hostel.rentStructure.map((rent) => (
//                 <tr key={rent._id} className="border-b">
//                   <td className="py-2">{rent.studentsPerRoom}</td>
//                   <td className="py-2">₹{rent.rentPerStudent}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <CalendarDays className="h-5 w-5" />
//               <span>Scheduled Visits</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {hostel.pendingVisits.slice(0, 3).map((visit) => (
//                 <li
//                   key={visit._id}
//                   className="flex justify-between items-center"
//                 >
//                   <span>{new Date(visit.visitDate).toLocaleDateString()}</span>
//                   <span>{visit.visitTime}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Star className="h-5 w-5" />
//               <span>Feedback</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-4">
//               {hostel.feedback.slice(0, 2).map((feedback) => (
//                 <li key={feedback._id} className="border-b pb-2">
//                   <div className="flex items-center space-x-2">
//                     <Avatar>
//                       <div className="bg-blue-500 w-full h-full flex items-center justify-center text-white">
//                         {feedback.student.charAt(0).toUpperCase()}
//                       </div>
//                     </Avatar>
//                     <div>
//                       <div className="flex items-center">
//                         {[...Array(feedback.rating)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                           />
//                         ))}
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         {feedback.comment}
//                       </p>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <MessageSquare className="h-5 w-5" />
//               <span>Complaints</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {hostel.complaints.slice(0, 3).map((complaint) => (
//                 <li key={complaint._id} className="border-b pb-2">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-semibold">{complaint.complaintType}</p>
//                       <p className="text-sm text-gray-600">
//                         {complaint.description}
//                       </p>
//                     </div>
//                     <Badge
//                       variant={
//                         complaint.status === "resolved" ? "success" : "warning"
//                       }
//                     >
//                       {complaint.status}
//                     </Badge>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default HostelProfile;
