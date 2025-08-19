import { Link } from 'react-router-dom';
export default function ReportCard({ report }){
  return (
    <div className="card overflow-hidden">
      {report.images?.[0] && <img className="w-full h-48 object-cover" src={report.images[0]} alt={report.title}/>}
      <div className="p-4">
        <span className={`text-xs px-2 py-1 rounded ${report.type==='LOST'?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>
          {report.type}
        </span>
        <h3 className="font-semibold mt-2">{report.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
        <div className="text-xs text-gray-500 mt-1">{report.city}</div>
        <Link to={`/reports/${report._id}`} className="text-blue-600 text-sm mt-2 inline-block">View details →</Link>
      </div>
    </div>
  );
}