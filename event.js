//add event to a match
router.post('/', (req, res) => {

   // Capturo el id del partido
   const matchId = req.body.matchId;

   // Capturo los datos del evento
   // Se puede hacer todo junto si los datos del body se llaman igual
   // q el nombre de la variable (const) q creas. Sino por separado
   // es lo mismo
   const { team, eventType, time, player, observation } = req.body;

   // Primero busco el partido con el id q paso por el body
   // y si lo encuentra creo el evento, y no antes. Para no
   // tener un evento creado sin un partido para pasarselo
   // findById por findOne si vas a usar el id para buscar
   Match.findById(matchId, (err, match) => { // Callback en vez de promesa, le paso el error y el partido q generaria el find
      if (err) {
         // manejo si hay un error en el find, por ej saltaria 
         // si pasaste por el body un matchId q es un string 
         // q no tiene un formato de mongoId
         // aca tiene q ir un return para q termine la ejecucion de la post request
         // un return con un error status 500 con algun mensaje
      }

      if (!match) {
         // si no hay match un 404 no hay partido con el id q se paso
         // aca tambien un return para terminar la ejecucion de la request
      }

      // Si no entro en los if esta todo bien
      // Ahora si crear el event nuevo con los datos del body
      const newEvent = new Event({
         eventType: eventType,
         team: team,
         time: time,
         player: player,
         observation: observation
      });

      // Salvo el evento
      newEvent.save((err, event) => { // Aca el callback trae el error y el evento q se guardo
         if (err) {
            // lo mismo, un error del save, hay q poner un return
         }

         // si todo va bien pusheo el evento al partido q encontramos antes
         match.events.push(event._id); // este es el event del collback no el newEvent

         // Guardamos el partido q ahora tiene un evento agregado
         match.save((err, match) => { // el match este del callback es opcional, es por si quieren q la request devuelva el partido con el nuevo evento agregado
            if (err) {
               // lo mismo un error del save, con un return
            }

            // y si todo va bien la respuesta
            res.status(201).json({ msg: 'Evento agregado', event: event, match: match }); // Aca lo q devuelve la request, tal vez no quieran el match y el event q se retorne

         });

      });

   });

   // Esto reemplazaria lo de arriba. Creo q asi seria con promesas

   Match.findById(matchId) // lo mismo primero busco el partido
      .exec()
      .then((err, match) => {
         if (err) {
            // return el error
         }

         if (!match) {
            // return 404 match not found
         }

         // si todo va bien creo el evento
         newEvent = new Event({ /*los datos*/ });

         // lo salvo
         newEvent.save() // aca no se si se puede encadenar las promesas, sino con callback con lo de antes
            .exec()
            .then((err, event) => {
               if (err) {
                  // return el error
               }

               // pusheo el evento
               match.events.push(event._id);

               // guardo el partido con el nuevo evento
               match.save()
                  .exec()
                  .then((err, event) => {
                     // lo mismo preparo los return su hay error o sino la respuesta final de la request
                  })

            })


      })

});