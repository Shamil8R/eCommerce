module.exports = {

    sudoAdminLoginCheck: (data) => {
        return new Promise((resolve,reject)=>{
            if(data.email === process.env.SUDO_ADMIN_EMAIL){
                if(data.password === process.env.SUDO_ADMIN_PASSWORD){
                    resolve({status: true})
                }else{
                    resolve({status: false})
                }
            }else{
                resolve({status: false})
            }       
        })
    },

    
}