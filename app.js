//Formulario
const formulario = document.getElementById('formulario');
const formInput = document.getElementById('form-input');
//Template
const templateTarea = document.getElementById('template-tarea').content;


//Contenedor de tareas
const listaTarea = document.getElementById('lista-tareas');

//Fragmento para evitar reflow
const fragment = document.createDocumentFragment();

let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    //Cargar localStorage
    if (JSON.parse(localStorage.getItem('tareas'))) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
    }
    //Pintar tareas anteriores en el DOM
    pintarTareas();
});




//Funcionalidades página
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    setTarea();

});


listaTarea.addEventListener('click', e => {
    btnAction(e);
});




const setTarea = e => {
    if (formInput.value.trim() === '') {
        return 0;
    }

    const tarea = {
        id: Date.now(),
        texto: formInput.value,
        estado: false
    }

    tareas[tarea.id] = {...tarea };



    formulario.reset();
    formInput.focus();

    pintarTareas();
}


const pintarTareas = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas));

    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
           <div class="alert alert-dark text-center mt-3">
                No hay tareas pendientes 😀
           </div> 
        `;
        return 0;
    }

    listaTarea.innerHTML = '';

    Object.values(tareas).forEach(tarea => {
        const clone = templateTarea.cloneNode(true);
        clone.querySelector('p').textContent = tarea.texto;

        if (tarea.estado) {
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-success');
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt');
            clone.querySelector('p').style.textDecoration = 'line-through';
        }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id;
        fragment.appendChild(clone);
    })

    listaTarea.appendChild(fragment);


}


const btnAction = e => {
    let isGreenButton = e.target.classList.contains('fa-check-circle');
    if (isGreenButton) {
        tareas[e.target.dataset.id].estado = true;
        pintarTareas();
        console.log(tareas);
    }

    let isRedButton = e.target.classList.contains('fa-minus-circle');
    if (isRedButton) {
        delete tareas[e.target.dataset.id]
        pintarTareas();
    }

    let isReloadButton = e.target.classList.contains('fa-undo-alt');
    if (isReloadButton) {
        tareas[e.target.dataset.id].estado = false;
        pintarTareas();
    }

    e.stopPropagation();
}