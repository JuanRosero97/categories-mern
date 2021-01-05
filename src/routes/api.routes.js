const express = require('express')
const router = express.Router()

const Category = require('../models/Categories')

// Obtiene las categorías almacenadas en la BD
router.get('/api/getCategories', async (req,res) => { 
    const category = await Category.find()
    res.json(category)
})

// Obtiene valores de una categoría mediante el id
router.get('/api/getCategories/:id', async (req,res) => { 
    const category = await Category.findById(req.params.id)
    res.json(category)
})

//Post para agregar una categoría a la BD
router.post('/api/getCategories', async (req,res) => {
    var userName = req.body.name
    const {background, name, description} = req.body; 
    const category = new Category ({background, name, description});
    Category.findOne({ name : userName }, await function(error, obj) { // Busca en caso de tener un nombre duplicado de ser así devuelvo error
        if (error || obj !== null) 
            res.status(500).json({ message: "Categoría duplicada." })
        else
            {
                try {
                    category.save(); 
                    res.status(200).json({ message: "Categoría guardada." })
                } catch (error) {
                    handleError(res, error.message);
                }                
            }
    })    
});

// Put para actualizar una categoría mediante id
router.put('/api/getCategories/:id', async (req,res) =>{    
    const body = req.body
    const category = { 
    background: body.background,
    name: body.name,
    description: body.description
    }
    await Category.findByIdAndUpdate(req.params.id, category);
    res.json({status: 'Categoría actualizada'})
});

//Delete para borrar una categoría mediante id
router.delete('/api/getCategories/:id', async (req,res) =>{
    await Category.findByIdAndRemove(req.params.id);
    res.json({status: 'Categoría eliminada'})
});

module.exports = router