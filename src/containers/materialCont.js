const mongoose = require('mongoose');
const materiales = require('../models/materialSchema')
const macro_materiales = require('../models/macroSchema')

let instanceMateriales = null
class Materiales {
    constructor() {
        this.material = [];
        this.value = Math.random()
    }

    static getInstance() {
        if(!instanceMateriales) {
            instanceMateriales = new Materiales()
        }
        return instanceMateriales
    }
    // PARA CARGAR NUEVOS MATERIALES
    async newMaterial(objeto) {
        try {
            let nuevoResiduo = {
                ID: objeto.ID,
                MATERIAL: objeto.MATERIAL,
                CATEGORIA1: objeto.CATEGORIA1,
                MACRO_CATEGORIA: objeto.MACRO_CATEGORIA,
            }
            let data = await new materiales(nuevoResiduo).save();
            return data
        } catch (error) {
            console.log(error);
        }
    }
    // PARA CARGAR LOS COMENTARIOS DE LAS MACRO CATEGORIAS
    async newMacroComentario(objeto) {
        try {
            let nuevoComentario = {
                MACRO_CATEGORIA: objeto.MACRO_CATEGORIA,
                COMENTARIOS: objeto.COMENTARIOS,
            }
            let data = await new macro_materiales(nuevoComentario).save();
            return data
        } catch {
            console.log(error);
        }
    }
    async getMateriales() {
        try {
            let data = await materiales.find();
            if (data.length == 0) {
                // logger.log("error", error.message)
                console.log("No se encontraron materiales");
            } else {
                return data;
            }
        } catch (error) {
            // logger.log("error", error.message)
            console.log(error);
        }
    }
    async getByID(ID) {
        try {
            let data = await materiales.aggregate([
                {$match : {_id: new mongoose.Types.ObjectId(ID)}},
                {$lookup: {
                    from: "macro_materials",
                    localField: 'MACRO_CATEGORIA',
                    foreignField: 'MACRO_CATEGORIA',
                    as: 'macroCat'
                }},
                {$unwind: '$macroCat'},
                ])
            return data
        } catch (error) {
            // logger.log("error", error.message)
            console.log(error);
        }
    }
    async getByFrase(frase) {
        try {
            let data = await materiales.find({$text: {$search: frase}}).sort({MATERIAL: 'desc'});
            if (data.length == 0) {
                // logger.log("error", error.message)
                // console.log("No se encontro el material: "+frase);
            } else {
                return data;
            }
        } catch (error) {
            // logger.log("error", error.message)
            console.log(error);
        }
    }
}

module.exports = Materiales