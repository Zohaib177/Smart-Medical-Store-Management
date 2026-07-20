function generateSaleNumber(id,date){const d=String(date).slice(0,10).replace(/-/g,'');return`SAL-${d}-${String(id).padStart(6,'0')}`;}module.exports={generateSaleNumber};
