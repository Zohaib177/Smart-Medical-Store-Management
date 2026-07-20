function generatePurchaseNumber(id,date){const d=new Date(`${date}T00:00:00Z`);const stamp=`${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}`;return `PUR-${stamp}-${String(id).padStart(6,'0')}`;}
module.exports={generatePurchaseNumber};
