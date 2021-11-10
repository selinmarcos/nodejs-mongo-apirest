const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Providers = require('../models/providers')
const Clientes = require('../models/clientes')
const Products = require('../models/products')
const Ventas = require('../models/ventas')
const detalleVenta = require('../models/detalleVenta')
const mongoose = require('mongoose')

const ObjectID = require('mongodb').ObjectID

//LOGIN & REGISTER

router.post('/register', async (req, res) => {
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
})

router.post('/login', async (req, res) => {
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
    console.log(token)
    res.cookie('jwt', token, {
        httpOnly: true,
        //secure: false, //added it
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success',
        token: token,
        user: user
    
    })
})

router.get('/user', async (req, res) => {

  
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            // return res.status(401).send({
            //     message: 'unauthenticated'
            // })
            res.send({message:'NO AUTENTICADO'})
        }

        const user = await User.findOne({_id: claims._id})

        const {pass, ...data} = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
})


//PROVIDERS-------------------------------------------------------------------------------
    //Create Provider
    router.post('/providers', async (req, res) => {

        const providers = new Providers({
            provider: req.body.provider,
            contact: req.body.contact,
            phone: req.body.phone,
            direccion: req.body.direccion,
        })
    
        const result = await providers.save()
    
        const {...data} = await result.toJSON()
    
        res.send(data)
    })

    //Show Provider
    router.get('/providers', async (req, res) => {
       // console.log('llegue')
        const filas = await Providers.find({})
    
        res.json(filas)
    })

    //DELETE
    router.delete('/providers/:id', async (req, res) => {
       
    
         const filas = await Providers.deleteOne({"_id":ObjectID(req.params.id)}) 
             
         
     
         res.json(filas)
     })

    //EDIT
    router.put('/providers/:id', async (req, res) => {
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
    })
    
//------------------------------------USERS-------------------------------------------------
    //GET -------------------------------------------------
    router.get('/users', async (req, res) => {
        // console.log('llegue')
        const filas = await User.find({})
    
        res.json(filas)
    })
    //DELETE-----------------------------------------------------------
    router.delete('/users/:id', async (req, res) => {
       
    
        const filas = await User.deleteOne({"_id":ObjectID(req.params.id)}) 
            
        
    
        res.json(filas)
    })
    //CREATE---------------------------------------------------------

    router.post('/users', async (req, res) => {
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
    })
    //



    //EDIT-------------------------------------------------------------

    router.put('/users/:id', async (req, res) => {
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
    })    


//-------------------------------CLIENTS------------------------------------------------
    //Create Client
    router.post('/clientes', async (req, res) => {

        const clientes = new Clientes({
            nombre: req.body.nombre,
            nit: req.body.nit,
            telefono: req.body.telefono,
            direccion: req.body.direccion,
        })
    
        const result = await clientes.save()
    
        const {...data} = await result.toJSON()
    
        res.send(data)
    })

    // //Show Clients
    router.get('/clientes', async (req, res) => {
        // console.log('llegue')
         const filas = await Clientes.find({})
     
         res.json(filas)
     })
 
     //DELETE
     router.delete('/clientes/:id', async (req, res) => {
        
     
          const filas = await Clientes.deleteOne({"_id":ObjectID(req.params.id)}) 
              
          
      
          res.json(filas)
      })

    //EDIT
    router.put('/clientes/:id', async (req, res) => {
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
    })

    //------------------------------PRODUCTS------------------------------------------------
    //show providers on select
    router.get('/prov', async (req, res) => {
        // console.log('llegue')
         const filas = await Providers.find({})
     
         res.json(filas)
     })
    
    
    
    
    //Create Product
    router.post('/products', async (req, res) => {

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
    })

    // //Show Product
    router.get('/products', async (req, res) => {
        // console.log('llegue')
         const filas = await Products.find({}) 
         //const fore = await Providers.findOne({idProvider:"6133c7b6a4781a4110ca81d6"})
         //console.log(fore)
         res.json(filas)
     })
 
     //DELETE
     router.delete('/products/:id', async (req, res) => {
        
     
          const filas = await Products.deleteOne({"_id":ObjectID(req.params.id)}) 
              
          
      
          res.json(filas)
      })

    //EDIT
    router.put('/products/:id', async (req, res) => {
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
    })

//------------------------VENTAS-----------------------------------------

//SEARCH CLIENT BY NIT

    router.get('/buscarcliente/:id', async (req, res) => {
        // console.log('llegue')
        const filas = await Clientes.findOne({nit:req.params.id})
      
        res.json(filas)
    })

//SHOW VENTAS 
router.get('/ventas', async (req, res) => {
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
 })

//PROCESAR VENTA (deben llenarse 2 tablas)
router.post('/ventas', async (req, res) => {

    var idClient = mongoose.Types.ObjectId(req.body.idClient);
    var idUser = mongoose.Types.ObjectId(req.body.idUser);
    
        const ventas = new Ventas({
            noFactura: req.body.noFactura,
            fecha: req.body.fecha,
            idClient: idClient,
            idUser: idUser,
            estado: req.body.estado,
            totalFactura: req.body.totalFactura
        })
    
        const result = await ventas.save()
    
        const {...data} = await result.toJSON()
        
        res.send(data)



    })

    
   
    router.post('/dventas', async (req, res) => {
        //obtenemos el ultimo documento insertado en ventas para asi usarlo en detalle venta
         const filas = await Ventas.findOne().sort({_id:-1}).limit(1)
         console.log("ventassss: "+filas._id)


            //Detalle Venta
            //var idProduct = mongoose.Types.ObjectId(req.body.idProduct);
            var idVenta = mongoose.Types.ObjectId(filas._id);
            var v = req.body.cantidad 

            //INSERTANDO DATOS DE UN ARRAY
            for(i=0;i<= v.length - 1;i++){
                console.log(v[i])
              
                const detalleV = new detalleVenta({
                    idProduct: v[i].idProduct0,
                    idVenta: idVenta, 
                    cantidad: v[i].cantidad,
                    precioVenta: v[i].priceT
                }) 
                    const result = await detalleV.save()
        
                    const {...data} = await result.toJSON()
        
                    res.send(data)
            }

        
        })







module.exports = router;
