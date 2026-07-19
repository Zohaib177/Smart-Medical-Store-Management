const ApiResponse=require('../utils/ApiResponse');const asyncHandler=require('../middleware/asyncHandler');const service=require('../services/inventoryService');
const listInventory=asyncHandler(async(req,res)=>{const r=await service.getInventory(req.query);return ApiResponse.paginated(res,{message:'Inventory retrieved successfully',data:r.data,pagination:r.pagination})});
const getSummary=asyncHandler(async(req,res)=>ApiResponse.success(res,{message:'Inventory summary retrieved successfully',data:await service.getInventorySummary()}));
const listHistory=asyncHandler(async(req,res)=>{const r=await service.getInventoryHistory(req.query);return ApiResponse.paginated(res,{message:'Inventory history retrieved successfully',data:r.data,pagination:r.pagination})});
const getMedicineHistory=asyncHandler(async(req,res)=>{const r=await service.getMedicineInventoryHistory(req.params.medicineId,req.query);return ApiResponse.paginated(res,{message:'Medicine inventory history retrieved successfully',data:{medicine:r.medicine,history:r.history},pagination:r.pagination})});
const adjustStock=asyncHandler(async(req,res)=>ApiResponse.success(res,{message:'Medicine stock adjusted successfully',data:await service.adjustMedicineStock(req.params.medicineId,req.admin.id,req.body)}));
module.exports={listInventory,getSummary,listHistory,getMedicineHistory,adjustStock};
