function switchForm(formType) {
    if (formType === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
    } else if (formType === 'register'){
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
    }
    else{
        console.log("make vis");
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('profile').style.display = 'flex';
    }
}

async function getPhotographerFullName(id){
    return fetch(`http://localhost:8080/photographerFullName/${id}`, {
        method: "GET",}
    )
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


document.getElementById("login-form").addEventListener("submit", event =>{
    event.preventDefault();
    console.log("Checking form..");
    let formData = new FormData(event.target);
    const data = {};
    let warning = document.getElementById("showMessageLogin");
    formData.forEach((value, key) => (data[key] = value));
    console.log(data);
   fetch("http://localhost:8080/login", {body: JSON.stringify(data), method: "POST", headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }}).then(async result =>{
        if (result.status == 200){
            warning.innerHTML = "";
            let res = await result.json()
            console.log(res);
            profileSet(res);                     
        }
        else {
            console.log("waiting");        
            let answer = await result.json();
            if (answer === ""){
                answer = "Ошибка авторизации!"
            }
            warning.innerHTML = answer;   
            warning.style.display = "block";
        }
        
      }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });;
    
});

document.getElementById("register-form").addEventListener("submit", event => {
    event.preventDefault();
    let formData = new FormData(event.target);
    const data = {};
    let warning = document.getElementById("showMessage");
    formData.forEach((value, key) => (data[key] = value));
    if (data.user_password != data.confirm_password) {
        document.querySelector("#confirmPasswordInput").style.display = "inline";
    }
    else{
        document.querySelector("#confirmPasswordInput").style.display = "none";
    }
    let checkbox = document.getElementById("isPhotographer");
    if (checkbox.checked) {
        data["user_role"] = "photographer";
    }
    else {
        data["user_role"] = "client";
    }
    console.log(data);
    fetch("http://localhost:8080/createUser", {body: JSON.stringify(data), method: "POST", headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }}).then(async result =>{
        if (result.status == 422 || result.status == 500){
            warning.innerHTML = await result.json();
        }
        else if (result.status == 200){
            switchForm('login');
            warning.innerHTML = "";
            alert("Регистрация прошла успешно! Теперь вы можете авторизоваться.")
        }
        else{
            warning.innerHTML = "";
        }
      }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });;
});

async function profileSet(user){
    const profile = document.getElementById('profile');
    profile.style.display = "flex";
    console.log(user);
    document.getElementById('login-form').style.display = 'none';
        profile.innerHTML = `<div class="constraint-layout">
        <div class="header_row">
        <img id="ava" class="avatar" width="500px" src="http://localhost:8080/photographerPhoto/${user.photographer_id}" alt="${user.photographer_id}" >
        
        </div>
        <h2 class="fio" id="fio1">${(await getPhotographerFullName(user.photographer_id)).partName}</h2>
        <p class="description" id="user_role">${(user.user_role === 'photographer') ? 'Фотограф' : 'Клиент'}</p>
        <p class="description" id="email">Email</p>
        <p class="email1">${user.photographer_email}</p>
        
        <button class="showMessageAnchor" id="edit" style="width: 300px; height: 52px;">Редактировать профиль</button> 
        <button class="exit" id="exit">Выйти из аккаунта</button>
        <div id="clear"><button class="showMessageAnchor" id="createPortfolio" style="width: 300px; height: 52px; margin:12px;">Создать портфолио</button></div>
    </div>`;
    if (document.getElementById("user_role").innerHTML == "Клиент"){
        document.getElementById("clear").innerHTML = "";
    }
    if (document.getElementById("user_role").innerHTML == "Фотограф") {
        // document.getElementById("addPortfolio1").innerHTML =  ;
        document.getElementById("createPortfolio").addEventListener("click", event=>{
            profile.style.display = "none";
            let portform = document.getElementById("portfolio-form");
            portform.style.display = "block";
            document.getElementById("turnbackPortfolio").addEventListener("click", event=>{
                portform.style.display = "none";
                profile.style.display = "flex"; 
            });
            document.getElementById("portfolio-form").addEventListener("submit", async event=>{
                event.preventDefault();
                let formData = new FormData(event.target);
                const data = {};
                let warning = document.getElementById("showMessageLogin");
                formData.forEach((value, key) => (data[key] = value));
                let photo_id = document.getElementById("ava").alt;
                data["photographer_id"] = photo_id;
                fetch(`http://localhost:8080/portfolio`, {body: JSON.stringify(data), method: "POST", headers: {
                'Content-Type': 'application/json;charset=utf-8'
              }}).catch(error =>{
                console.log("Error in update " + error);
              });
              portform.style.display = "none";
              profile.style.display = "flex";    
            });
        });
    }
    document.getElementById("exit").addEventListener('click', function(){
        fetch("http://localhost:8080/exit", {
            method: "GET",}
        );
        location.reload();
    });
    document.getElementById("edit").addEventListener('click', function(){
        profile.style.display = "none";
        let editform = document.getElementById("edit-form");
        editform.style.display = "block";
        document.getElementById("update-name").value = user.photographer_name;
        document.getElementById("update-surname").value = user.photographer_surname;
        document.getElementById("update-patronymic").value = user.photographer_patronymic;
        document.getElementById("update-email").value = user.photographer_email;
        document.getElementById("edit-form").addEventListener("submit", async event=>{
            event.preventDefault();
            let formData = new FormData(event.target);
            const data = {};
            let warning = document.getElementById("showMessageLogin");
            formData.forEach((value, key) => (data[key] = value));
            let photo_id = document.getElementById("ava").alt;
            data["photographer_id"] = photo_id;
            console.log(data);
            fetch(`http://localhost:8080/photographer/${user.photographer_id}`, {body: JSON.stringify(data), method: "PUT", headers: {
                'Content-Type': 'application/json;charset=utf-8'
              }}).catch(error =>{
                console.log("Error in update " + error);
              });            
            //   console.log(data);
            editform.style.display = "none";
            profile.style.display = "flex";
            user.photographer_name = document.getElementById("update-name").value;
            user.photographer_surname = document.getElementById("update-surname").value;
            user.photographer_patronymic = document.getElementById("update-patronymic").value;
            user.photographer_email = document.getElementById("update-email").value;
            user.photographer_id = document.getElementById("ava").alt;
            console.log(user);
            // profileSet(user);
            document.getElementById("fio1").innerHTML = user.photographer_name + " " + user.photographer_surname + " " + user.photographer_patronymic;
            document.getElementById("email1").innerHTML = user.photographer_email;
            // profileSet(user);
            // document.getElementById("fio1").value = data["photographer_name"] + data["photographer_surname"] + data["photographer_patronymic"];
            // document.getElementById("email1").value = data["photographer_email"];
        });
            
            
            // document.getElementById("fio1.fio").innerHTML = document.getElementById("update-name").value +" "+ document.getElementById("update-surname").value+" " + document.getElementById("update-patronymic").value;
            // document.getElementById("email1").innerHTML = document.getElementById("update-email").value;
            document.getElementById("turnback").addEventListener("click", event=>{
            editform.style.display = "none";
            profile.style.display = "flex";
        })
    });
        switchForm("user")
}
async function chooseContent(){
    console.log("Started to choose");
    let user = fetch("http://localhost:8080/checkSession", {    
        method: "GET"     
    }).then(response => {
        console.log(response);
        if (response.status === 200){
            return response.json();
        }
        else{
            console.log("na")
            return "NA";
        }
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    user = await user;
    console.log(user);
    if (user !== "NA"){
        console.log("We did it");
        console.log(user);
        
    }
}
// document.addEventListener('DOMContentLoaded', chooseContent);