const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Providers = require('../models/providers')
const Clientes = require('../models/clientes')
const Products = require('../models/products')
const Ventas = require('../models/ventas')
const detalleVenta = require('../models/detalleVenta')
const Business = require('../models/business')

const mongoose = require('mongoose')

const ObjectID = require('mongodb').ObjectID
const ventas = require('../models/ventas')

//LOGIN & REGISTER

router.post('/register', async (req, res) => {
    try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.pass, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        user: req.body.user,
        phone: req.body.phone,
        rol: req.body.rol,
        pass: hashedPassword,
    })

    const result = await user.save()

    const {pass, ...data} = await result.toJSON()

    res.send(data)
        
    } catch (error) {
        console.log(error)
        
    }
    
})

router.post('/login', async (req, res) => {
    try {
        console.log('llegamos aqui a login')
        const user = await User.findOne({email: req.body.email})

    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        })
    }

    if (!await bcrypt.compare(req.body.pass, user.pass)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }
    
    const token = jwt.sign({_id: user._id}, "secret")
    
    res.cookie('jwt', token, {
        sameSite: 'none',
        httpOnly: true,
        secure: true, //added it
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    console.log('IMPRIMIENDO TOKEN'+res.json({token:token}))
    res.json({
        token: token,
        message: 'success',

    })
    //res.json(User)
        
    } catch (error) {
        
        console.log(error)
    }
    
    
})

router.get('/user', async (req, res) => {

    try {
        
      
        const cookie = req.cookies['jwt']
        console.log('ENTRAMOS A USER'+ cookie)

        const claims = jwt.verify(cookie, 'secret')
        
        if (!claims) {
            // return res.status(401).send({
            //     message: 'unauthenticated'
            // })
            res.send({message:'NO AUTENTICADO'})
        }
        
        const user = await User.findOne({_id: claims._id})
        
        const {pass, ...data} = await user.toJSON()
        console.log('AUTENTICADO'+data)
        res.json(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    try {
        
        res.cookie('jwt', '', {maxAge: 0})
        //añadimos clearcookie para probar
        res.clearCookie("jwt")

        res.send({
            message: 'success'
        })
        
    } catch (error) {
        
    }

})


//-------------------------------PROVIDERS-------------------------------------------------------------------------------
    //Create Provider
    router.post('/providers', async (req, res) => {
        console.log('ME ESTOY EJECUTANDO')
        try {
            const providers = new Providers({
                provider: req.body.provider,
                contact: req.body.contact,
                phone: req.body.phone,
                direccion: req.body.direccion,
            })
        
            const result = await providers.save()
        
            const {...data} = await result.toJSON()
        
            res.send(data)
            
        } catch (error) {
            console.log(error)
        }

       
    })

    //Show Provider
    router.get('/providers', async (req, res) => {
        try {
            // console.log('llegue')
            const filas = await Providers.find({})
                res.json(filas)
            
        } catch (error) {
            console.log(error)
            
        }

    })

    //DELETE
    router.delete('/providers/:id', async (req, res) => {
       try {
        const filas = await Providers.deleteOne({"_id":ObjectID(req.params.id)})             
        res.json(filas)
           
       } catch (error) {
           console.log(error)
           
       }
    

     })

    //EDIT
    router.put('/providers/:id', async (req, res) => {
        try {
            //const {id} = req.params
        const providers = {
            provider: req.body.provider,
            contact: req.body.contact,
            phone: req.body.phone,
            direccion: req.body.direccion
        }
        //console.log(req.params.id)
         await Providers.updateOne({_id:ObjectID(req.params.id)},{$set:providers}) 
      
                //res.send(results)
                //res.json(filas)
                res.json({
                    message: 'campo actualizado'
                })   
            
        } catch (error) {
            console.log(error)
        }
        
    })
    
//------------------------------------USERS-------------------------------------------------
    //GET -------------------------------------------------
    router.get('/users', async (req, res) => {
        try {
                    // console.log('llegue')
        const filas = await User.find({})
        res.json(filas)
            
        } catch (error) {
            console.log(error)
        }

    })
    //DELETE-----------------------------------------------------------
    router.delete('/users/:id', async (req, res) => {
        try {
            const filas = await User.deleteOne({"_id":ObjectID(req.params.id)}) 
            res.json(filas)
            
        } catch (error) {
            console.log(error)
        }
       
    

    })
    //CREATE---------------------------------------------------------

    router.post('/users', async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.pass, salt)
        //console.log(req.body.name)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                user: req.body.user,
                phone: req.body.phone,
                rol: req.body.rol,
                pass: hashedPassword,
            })
        
            const result = await user.save()
        
            const {pass, ...data} = await result.toJSON()
        
            res.send(data)
            
        } catch (error) {
            console.log(error)
        }

    })
    //



    //EDIT-------------------------------------------------------------

    router.put('/users/:id', async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.pass, salt)
            //const {id} = req.params
            const users = {
                name: req.body.name,
                email: req.body.email,
                user: req.body.user,
                phone: req.body.phone,
                rol: req.body.rol,
                pass: hashedPassword,
            }
            //console.log(req.params.id)
             await User.updateOne({_id:ObjectID(req.params.id)},{$set:users}) 
          
                    //res.send(results)
                    //res.json(filas)
                    res.json({
                        message: 'campo actualizado'
                    })   
            
        } catch (error) {
            console.log(error)
        }

    })    


//-------------------------------CLIENTS------------------------------------------------
    //Create Client
    router.post('/clientes', async (req, res) => {
        try {
            const clientes = new Clientes({
                nombre: req.body.nombre,
                nit: req.body.nit,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
            })
        
            const result = await clientes.save()
        
            const {...data} = await result.toJSON()
        
            res.send(data)
            
        } catch (error) {
            console.log(error)
        }


    })

    // //Show Clients
    router.get('/clientes', async (req, res) => {
        try {
        // console.log('llegue')
         const filas = await Clientes.find({})
     
         res.json(filas)
            
        } catch (error) {
            console.log(error)
        }

     })
 
     //DELETE
     router.delete('/clientes/:id', async (req, res) => {
         try {
            const filas = await Clientes.deleteOne({"_id":ObjectID(req.params.id)}) 
            res.json(filas)
             
         } catch (error) {
             console.log(error)
             
         }
        
     

      })

    //EDIT
    router.put('/clientes/:id', async (req, res) => {
        try {
                    //const {id} = req.params
        const clientes = {
            nombre: req.body.nombre,
            nit: req.body.nit,
            telefono: req.body.telefono,
            direccion: req.body.direccion
        }
        //console.log(req.params.id)
         await Clientes.updateOne({_id:ObjectID(req.params.id)},{$set:clientes}) 
      
                //res.send(results)
                //res.json(filas)
                res.json({
                    message: 'campo actualizado'
                })   
            
        } catch (error) {
            console.log(error)   
        }

    })

    //------------------------------PRODUCTS------------------------------------------------
    //show providers on select
    router.get('/prov', async (req, res) => {
        try {
         // console.log('llegue')
         const filas = await Providers.find({})
     
         res.json(filas)
        } catch (error) {
            console.log(error)
        }

     })
    
    
    
    
    //Create Product
    router.post('/products', async (req, res) => {
        try {
                    //const filas = await Providers.findById(req.body.idProvider)
        //console.log(filas.provider)
        const products = new Products({
            description: req.body.description,
            stock: req.body.stock,
            price: req.body.price,
            idProvider: req.body.idProvider
        })
    
        const result = await products.save()
    
        const {...data} = await result.toJSON()
    
        res.send(data)
            
        } catch (error) {
            console.log(error)
        }


    })

    // //Show Product
    router.get('/products', async (req, res) => {
        try {
        // console.log('llegue')
         const filas = await Products.find({}) 
         //const fore = await Providers.findOne({idProvider:"6133c7b6a4781a4110ca81d6"})
         //console.log(fore)
         res.json(filas)
            
        } catch (error) {
            console.log(error)
        }

     })
 
     //DELETE
     router.delete('/products/:id', async (req, res) => {
         try {          
          const filas = await Products.deleteOne({"_id":ObjectID(req.params.id)}) 
          res.json(filas)
         } catch (error) {
           console.log(error)  
         }
      })

    //EDIT
    router.put('/products/:id', async (req, res) => {
        try {
                    //const {id} = req.params
        const products = {
            description: req.body.description,
            stock: req.body.stock,
            price: req.body.price,
            idProvider: req.body.idProvider
        }
        //console.log(req.params.id)
         await Products.updateOne({_id:ObjectID(req.params.id)},{$set:products}) 
      
                //res.send(results)
                //res.json(filas)
                res.json({
                    message: 'campo actualizado'
                })  
            
        } catch (error) {
            console.log(error)
        }
 
    })

//------------------------VENTAS-----------------------------------------

//SEARCH CLIENT BY NIT

    router.get('/buscarcliente/:id', async (req, res) => {
        try {
        // console.log('llegue')
        const filas = await Clientes.findOne({nit:req.params.id})
        res.json(filas)
        } catch (error) {
          console.log(error)  
        }

    })

//SHOW VENTAS 
router.get('/ventas', async (req, res) => {
    try {
        const filas = await Ventas.aggregate(
            [
                {
                    $lookup:{
                        from: "clientes",
                        localField: "idClient",
                        foreignField: "_id",
                        as: "idCliente"
                    },
        
                },
                { $unwind:"$idCliente"}, 
                {
                    $lookup:{
                        from: "users",
                        localField: "idUser",
                        foreignField: "_id",
                        as: "idUsuario"
                    }
    
                },
                // // para mostrar en un objeto
                { $unwind:"$idUsuario"}
     
    
            ]
        ) 
      
        res.json(filas)
        
    } catch (error) {
        console.log(error)
    }
    
 })

//PROCESAR VENTA (deben llenarse 2 tablas primero ventas... luego extraemos el id de ventas para insertar en detalleVenta)
router.post('/ventas', async (req, res) => {

try{
    var idClient = mongoose.Types.ObjectId(req.body.idClient);
    var idUser = mongoose.Types.ObjectId(req.body.idUser);
  
         const ventas = new Ventas({
            noFactura: await sequence(),
            fecha: req.body.fecha,
            idClient: idClient,
            idUser: idUser,
            estado: req.body.estado,
            totalFactura: req.body.totalFactura
        })
    //funcion para el autoincremente del campo noFactura
        async function sequence(){
            const filaS = await Ventas.findOne().sort({_id:-1}).limit(1)
            //comprobamos si en ventas hay registros para en 1 o sumarle.
           if(filaS!=null){
            var idVenta = mongoose.Types.ObjectId(filaS._id);

            const filas = await Ventas.findOne({_id:idVenta})
             //console.log('NUMERO DE FACTURA'+filas.noFactura)
             console.log(filas.noFactura)
            return filas.noFactura + 1

           }else{
               return 1
           }


        }
 
    
        const result = await ventas.save()
    
        const {...data} = await result.toJSON()
        
        res.send(data)
        console.log('ME COMPLETE PORFIN ')

}catch(error){
    console.log('FATAL ERRO EN VENTAS'+ error)
}




    })


   
    router.post('/dventas', async (req, res) => {
        try {
            
      
        console.log('VOY PRIMERO IDIOTA')
        //obtenemos el ultimo documento insertado en ventas para asi usarlo en detalle venta
         const filas = await Ventas.findOne().sort({_id:-1}).limit(1)
         console.log("ventassss: "+filas._id)


            //Detalle Venta
            //var idProduct = mongoose.Types.ObjectId(req.body.idProduct);
            var idVenta = mongoose.Types.ObjectId(filas._id);
            var v = req.body.cant
            console.log(v.length)
            //INSERTANDO DATOS DE UN ARRAY
            for(i=0;i< v.length ;i++){
              
              
                const detalleV = new detalleVenta({
                    idProduct: v[i].idProduct0,
                    idVenta: idVenta, 
                    cantidad: v[i].cantidad,
                    precioVenta: v[i].priceT,
                    //CAMPOS ESTATICOS FACTURA NECESARIOS
                    productName:v[i].description0,
                    productPrice:v[i].price0,
                }) 
                  console.log(detalleV)
                    // const result = 
                    await detalleV.save()
                //comentamos estas dos ultimas lineas por que si no produce un error de headers y solo imprime 2 iteraciones
                    // const {...data} = await result.toJSON()
        
                    // res.send(data)
            }
            
            res.send('successfull')
        } catch (error) {
            console.log('FATAL ERROR EN DVENTAS'+error)
        }

        
        })


      //STOCK (REDUCIMOS CADA VENTA)
      router.put('/stock', async (req, res) => {
          try {
            console.log('STOCK')

            var s = req.body.cant
            for(i=0;i< s.length ;i++){
                var idProduct= s[i].idProduct0
                const actual = await Products.findOne({_id:idProduct})
                //res.json(actual)
                console.log('IMPRIMIENDO STOCK ACTUAL'+ actual.stock)
                const products = {
                    
                    stock: actual.stock - s[i].cantidad,
                    
                }     
                await Products.updateOne({_id:ObjectID(idProduct)},{$set:products}) 
            }
    
            res.send('successfull')
          
                    // res.json({
                    //     message: 'campo actualizado'
                    // })   
              
          } catch (error) {
              console.log(error)
          }
        
       
    })  

    //STOCK - INPUT FIELD NUMBER
    router.get('/products/:id', async (req, res) => {
        try {
            // console.log('llegue')
            const filas = await Products.findOne({_id:req.params.id})
            res.json(filas)
        //console.log(filas)
        } catch (error) {
            console.log(error)
        }

    })




//-----------------------------------DATOS DE LA EMPRESA--------------------------------------------------

//CREATE
router.post('/business', async (req, res) => {
    try {
        //const filas = await Providers.findById(req.body.idProvider)
    //console.log(filas.provider)
    const business = new Business({
     
        nit: req.body.nit,
        phone: req.body.phone,
        email: req.body.email,
        companyName: req.body.companyName,
        companyLegalName: req.body.companyLegalName,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        iva: req.body.iva,
        
    })

    const result = await business.save()

    const {...data} = await result.toJSON()

    res.send(data)
        
    } catch (error) {
        console.log(error)
    }

    
})
//SHOW COMPANY
router.get('/business', async (req, res) => {
    try {
            // console.log('llegue')
        const filas = await Business.find({}) 
        //const fore = await Providers.findOne({idProvider:"6133c7b6a4781a4110ca81d6"})
        //console.log(fore)
        res.json(filas)
        
    } catch (error) {
        console.log(error)
    }
    
 })
 //

//  //DELETE
//  router.delete('/products/:id', async (req, res) => {
    
//       const filas = await Products.deleteOne({"_id":ObjectID(req.params.id)}) 
//       res.json(filas)
//   })

//EDIT BUSINESS
router.put('/business/:id', async (req, res) => {
    try {
        
    console.log(req.params.id)
    const business = {
        nit: req.body.nit,
        phone: req.body.phone,
        email: req.body.email,
        companyName: req.body.companyName,
        companyLegalName: req.body.companyLegalName,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        iva: req.body.iva,
    }

   
     await Business.updateOne({_id:ObjectID(req.params.id)},{$set:business}) 
  

            res.json({
                message: 'campo actualizado'
            })   
        
    } catch (error) {
        console.log(error)
    }

})


//---------------------------------TABLA VENTAS----------------------------------
router.get('/dventas/:id', async (req, res) => {
        try {
             //  const filas = await detalleVenta.find({idVenta:req.params.id}) 
        //  res.json(filas)

        //guardamos en una variable req.params.id porque si no no funciona directo....
        //el $match es como un where para filtrar solo los detalles de venta con el id especifico.. 
        var idDV = mongoose.Types.ObjectId(req.params.id)
        const filas = await detalleVenta.aggregate(
         
          [ 
              {
                  $match:{
                      idVenta:idDV
                  }

              },
              // Comentamos el lookup a productos porque  si no lo hacemos seguira enlazandose con 'products' y no mostrara el producto eliminado a momento de generar la factura.
              // {
              //     $lookup:{
              //         from: "products",
              //         localField: "idProduct",
              //         foreignField: "_id",
              //         as: "product"
              //     },
      
              // },
              
              // { $unwind:"$product"}, 
              {
                  $lookup:{
                      from: "ventas",
                      localField: "idVenta",
                      foreignField: "_id",
                      as: "venta"
                  }
  
              },
              // // para mostrar en un objeto
              { $unwind:"$venta"},
            
   
  
          ]
      ) 
      
      res.json(filas)

            
        } catch (error) {
            console.log(error)
        }
       
    
    })








module.exports = router;
