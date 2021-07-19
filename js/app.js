const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');


const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector('#citas');

let editando;


eventListeners()
function eventListeners(){
    mascotaInput.addEventListener('input',datosCita)
    propietarioInput.addEventListener('input',datosCita)
    telefonoInput.addEventListener('input',datosCita)
    fechaInput.addEventListener('input',datosCita)
    horaInput.addEventListener('input',datosCita)
    sintomasInput.addEventListener('input',datosCita)

    formulario.addEventListener('submit',nuevaCita)

}

let citasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomasInput: ''
}

// Class

class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas,cita]
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

}

class UI{
    imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;
        if(!document.querySelector('.alert-danger')){
            document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'))
            
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }

    imprimirCitas({citas}){
        this.limpiarHTML();
        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas,id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id;


            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario:</span>${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono:</span>${telefono}`;
            
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha:</span>${fecha}`;
            
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora:</span>${hora}`;
            
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas:</span>${sintomas}`;


            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>`

            btnEliminar.onclick = () => eliminarCita(id)

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>`

            btnEditar.onclick = () => cargarEdicion(cita)

            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)


            contenedorCitas.appendChild(divCita)

        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();



// Functions

function datosCita(e){
    citasObj[e.target.name] = e.target.value
}


function nuevaCita(e){
    e.preventDefault();
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citasObj;

    if(mascota === '' || propietario === '' || telefono === ''|| fecha === ''|| hora === ''|| sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios','error');

        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado Correctamente');

        administrarCitas.editarCita({...citasObj});

        formulario.querySelector('button[type="submit"]').textContent = 'Agregar Cita'
        editando = false;
    }else{
        // generar un id
        citasObj.id = Date.now();

        administrarCitas.agregarCita({...citasObj})

        ui.imprimirAlerta('Se agrego correctamente')
    }
    

    // Reset formulario y reiniciar formulario
    formulario.reset()
    reiniciarObjeto();

    ui.imprimirCitas(administrarCitas)


}

function reiniciarObjeto(){
    citasObj.mascota = '';
    citasObj.propietario = '';
    citasObj.telefono = '';
    citasObj.fecha = '';
    citasObj.hora = '';
    citasObj.sintomas = '';
}

function eliminarCita(id){
    administrarCitas.eliminarCita(id)
    ui.imprimirAlerta('La cita se elimino Correctamente')
    ui.imprimirCitas(administrarCitas)
}

function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas,id} = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citasObj.mascota = mascota;
    citasObj.propietario = propietario;
    citasObj.telefono = telefono;
    citasObj.fecha = fecha;
    citasObj.hora = hora;
    citasObj.sintomas = sintomas;
    citasObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambio'

    editando = true
}