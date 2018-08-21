class UserController{

	constructor(formId, tableId){
		this.formEl = document.getElementById(formId);
		this.tableEl = document.getElementById(tableId);
		this.onSubmit();
		this.onEdit();
	}

	onEdit(){
		document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
			this.showPanelCreate();
		});
	}

	onSubmit(){		
		this.formEl.addEventListener("submit", event =>{			
			event.preventDefault();		
			let btn = this.formEl.querySelector("[type=submit]");
			btn.disabled = true;// Desabilita o botão de salvar
			let values = this.getValues();
			if(!values) return false;
			this.getPhoto().then((content)=>{//Se der certo
				values.photo = content;
				this.addLine(this.getValues());
				this.formEl.reset(); // Reseta o formulário
				btn.disabled = false; //Habilita o botão de salvar
			}, (e)=>{//Se der errado
				console.error(e);
			});		
		});
	}

	getPhoto(){
		return new Promise((resolve, reject)=>{
			let fileReader = new FileReader();
			let elements = [...this.formEl.elements].filter(item=>{
				if (item.name === 'photo') {
					return item;
				}
			});
			let file = elements[0].files[0];
			fileReader.onload = () => {
				resolve(fileReader.result);
			};	
			fileReader.onerror = (e) => {
				reject(e);
			};	
			if(file){
				fileReader.readAsDataURL(file);
			}else{
				resolve('dist/img/boxed-bg.jpg');
			}
		});		
	}

	getValues(){
		let user = {};
		let isValid = true;
		// Abaixo segue o recurdo do Spread
		[...this.formEl.elements].forEach(function(field, index){

			if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){ // Verifica se dentro do Foreach há algum valor com estes dentro do perguntado pelo If e não tem valor
				//Se for verdade, alteramos a classe no elemento para mostrar mensagem de erro
				field.parentElement.classList.add('has-error');
				isValid = false;

			}

			if(field.name == "gender"){
				if(field.checked){
					user[field.name] = field.value;	
				}
			}else if(field.name == "admin"){
				user[field.name] = field.checked;
			}else{
				user[field.name] = field.value;	
			}		
		});

		if(!isValid){
			return false;
		}
		return new User(
			user.name, 
			user.gender, 
			user.birth, 
			user.country, 
			user.email, 
			user.password, 
			user.photo, 
			user.admin
		);		
	}

	addLine(dataUser){
		
		let tr = document.createElement('tr');

		tr.dataset.user = JSON.stringify(dataUser);

		tr.innerHTML = `
			<tr>
	            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
	            <td>${dataUser.name}</td>
	            <td>${dataUser.email}</td>
	            <td>${(dataUser.admin)? 'Sim' : 'Não'}</td>
	            <td>${Utils.dateFormat(dataUser.register)}</td>
	            <td>
	                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
	                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	            </td>
	        </tr>  	`;		
	    tr.querySelector(".btn-edit").addEventListener("click",e =>{

	    	console.log(JSON.parse(tr.dataset.user));
	    	this.showPanelUpdate();

	    });

		this.tableEl.appendChild(tr);

		this.updateCount();
	}

	// Este método serve para mostrar o box de gravar usuários, alterando as propriedades no documento pelo ID
	showPanelCreate(){
		document.querySelector("#box-user-create").style.display = "block";
	    document.querySelector("#box-user-update").style.display = "none";
	}

	// Este método serve para mostrar o box de editar usuários, alterando as propriedades no documento pelo ID
	showPanelUpdate(){
		document.querySelector("#box-user-create").style.display = "none";
	    document.querySelector("#box-user-update").style.display = "block";
	}

	// Este método serve para fazer contagem entre os números de usuários e admin, no final os valores são inseridos no documento via innerHTML
	updateCount(){
		let numberUsers = 0;
		let numberAdmin = 0;
		//Uso de Spread vai pegar todos os elementos e distribuir em um Array, assim é possivel fazer um foreach
		[...this.tableEl.children].forEach(tr=>{
			numberUsers++;
			let user = JSON.parse(tr.dataset.user);
			if(user._admin) numberAdmin++;
		});
		document.querySelector("#number-users").innerHTML = numberUsers;
		document.querySelector("#number-admin").innerHTML = numberAdmin;
		
	}

}