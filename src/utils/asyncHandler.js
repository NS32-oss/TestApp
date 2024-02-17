// const asyncHandler=(fn)=>async (req,res,next)=>{
//     try{
//         await fn(req,res,next);
//     }catch(err){
//         res.status(err.code||500).json({
//             message:err.message||'An unknown error occurred!',
//             success:false
//         });

//         next(err);
//     }
// }
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
