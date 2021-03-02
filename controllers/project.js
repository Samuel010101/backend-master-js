'use strict'

var Project = require('../models/project');
// Modulo para mejorar el codigo a la hora de subir archivos --> line 126-132
var fs = require('fs');
var path = require('path');


var controller = {

	home: function(req, res){
		return res.status(200).send({
			message: "Soy la home"
		});

	},

	test: function(req, res){
		return res.status(200).send({
			message: "Soy el metodo test del contralador de project"
		});

	},

	// Esto es un metodo para almacenar los proyectos en la base de datos
	saveProject: function(req, res){
		var project = new Project();

		var params = req.body;
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;

		project.save((err, projectStored) => {
			if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

			if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el documento'});

			return res.status(200).send({project: projectStored});
		});

		/*
		return res.status(200).send({
			project: project,
			message: "Metodo saveProject"
		});
		*/
	},

	// Metodo para hacer una peticion(listar proyecto del portafolio) de algun proyecto a la base de datos por su id
	getProject: function(req, res){
		var projectId = req.params.id;

		// Esta linea de codigo se utiliza si al crear la ruta le pasamos el id? como parametro opcional, entonces hacemos esta validacion 
		if(projectId == null) return res.status(404).send({message: "El proyecto no existe"});

		Project.findById(projectId, (err, project) => {

			if(err) return res.status(500).send({message: "Error al devolver los datos"});

			if(!project) return res.status(404).send({message: "El proyecto no existe"});

			return res.status(200).send({project});

		});
	},

	// Metodo para devolver listado de proyectos
	getProjects: function(req, res){

		Project.find({}).sort('-year').exec((err, projects) => {

			if(err) return res.status(500).send({message: "Error al devolver los datos"});

			if(!projects) return res.status(404).send({message: "No hay proyectos para mostrar"});

			return res.status(200).send({projects}); 
		});

	},

	// Metodo update Project
	updateProject: function(req, res){
		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdate) => {

			if(err) return res.status(500).send({message: "Error al actualizar"});

			if(!projectUpdate) return res.status(404).send({message: "No existe el proyecto para actualizar"});

			return res.status(200).send({project: projectUpdate});

		});

	},

	// Metodo Delete
	deleteProject: function(req, res){
		var projectId = req.params.id

		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {

			if(err) return res.status(500).send({message: "No se ha podido borrar el proyecto"});

			if(!projectRemoved) return res.status(404).send({message: "No se ha podido encontrar el proyecto"});

			return res.status(200).send({project: projectRemoved}); 
		});


	},

	// Metodo para subir archivo(imagen)
	uploadImage: function(req, res){
		var projectId = req.params.id;
		var fileName = "Imagen no subida";

		if(req.files){
			var filePath = req.files.image.path;
			var fileSplit = filePath.split('/');
			var fileName = fileSplit[1];
			// EL BLOQUE DE CODIGO DE MEJORAMIENTO NO ESTA FUNCIONANDO CORRECTAMENTE VIRIFICAR EL NUMERO DE INDICE DE LA EXT
			// Mejorar este metodo, que cuando un archivo no tenga la extesion correcta o no sea cargado correctamente lo borre
			//var extSplit = fileName.split('\.');
			//var fileExt = extSplit[1];

			// Esta linea es parte de la mejora aplicada a este metodo
			//if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
				
				Project.findByIdAndUpdate(projectId, {image: fileName}, {new: true}, (err, projectUpdate) => {
						if(err) return res.status(500).send({message: "La imagen no se ha subido"});

						if(!projectUpdate) return res.status(404).send({message: "El proyecto no existe"});

						return res.status(200).send({project: projectUpdate});

					}); 
					
					// Este else es parte del codigo de mejoramiento 
					/*
				}else{
					

					fs.unlink(filePath, (err) => {
						return res.status(200).send({message: "La extensión no es valida"});
					});
				} 
					*/
			}else{
				return res.status(200).send({
					message: fileName
				});
			}
	

		},

		// Estraer la imagen de un proyecto desde la base de datos a la vista
		getImageFile: function(req, res){
			var file = req.params.image;
			var path_file = './uploads/'+file;

			fs.exists(path_file, (exists) => {
				if(exists){
					return res.sendFile(path.resolve(path_file));
				}else {
					return res.status(200).send({
						message: "No existe la imagen..."
					});
				}
			});
		}




};

module.exports = controller;




















































