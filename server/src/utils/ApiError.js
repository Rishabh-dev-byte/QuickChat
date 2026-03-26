class ApiError extends Error{
     constructor(statuscode,message="something went wrong",error=[]){
        super(message)
        this.statuscode=statuscode
        this.message=message
        this.error=error
        this.data=null
        this.success=false
     }
}

export default ApiError