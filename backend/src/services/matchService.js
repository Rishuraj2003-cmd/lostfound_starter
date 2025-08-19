import Report from '../models/Report.js';
export async function findPotentialMatches(report){
  try{
    const [lng,lat] = report.geo.coordinates;
    return Report.find({
      _id: { $ne: report._id },
      type: report.type === 'LOST' ? 'FOUND' : 'LOST',
      category: report.category,
      geo: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: 5000 } }
    }).limit(5);
  }catch(e){ return []; }
}