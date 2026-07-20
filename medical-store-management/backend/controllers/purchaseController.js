const ApiResponse=require('../utils/ApiResponse');const asyncHandler=require('../middleware/asyncHandler');const s=require('../services/purchaseService');
const listPurchases=asyncHandler(async(req,res)=>{const r=await s.getPurchases(req.query);return ApiResponse.paginated(res,{message:'Purchases retrieved successfully',data:r.data,pagination:r.pagination});});
const getPurchaseSummary=asyncHandler(async(req,res)=>ApiResponse.success(res,{message:'Purchase summary retrieved successfully',data:await s.getPurchaseSummary()}));
const getPurchaseOptions=asyncHandler(async(req,res)=>ApiResponse.success(res,{message:'Purchase form options retrieved successfully',data:await s.getPurchaseOptions()}));
const getPurchase=asyncHandler(async(req,res)=>ApiResponse.success(res,{message:'Purchase retrieved successfully',data:{purchase:await s.getPurchaseById(req.params.id)}}));
const createPurchase=asyncHandler(async(req,res)=>ApiResponse.created(res,{message:'Purchase created successfully',data:{purchase:await s.createPurchase(req.admin.id,req.body)}}));
const cancelPurchase=asyncHandler(async(req,res)=>ApiResponse.success(res,{message:'Purchase cancelled successfully',data:{purchase:await s.cancelPurchase(req.params.id,req.admin.id,req.body)}}));
module.exports={listPurchases,getPurchaseSummary,getPurchaseOptions,getPurchase,createPurchase,cancelPurchase};
