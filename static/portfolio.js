document.addEventListener("DOMContentLoaded", function(){

    axios.get(`http://127.0.0.1:5000/api/projects/${document.querySelector("#projects").getAttribute("data-id")}`).then((projects) => {
        projects.data.forEach(project => {
        
            axios.get(`https://api.github.com/repos/${project["owner_name"]}/${project["project_name"]}/readme`).then((data) =>{
                document.getElementById(`${project["id"]}-readme`).innerHTML = `<div class="col">${atob(data.data["content"])}</div>`}).then((data) => {
                    
            axios.get(`https://api.github.com/repos/${project["owner_name"]}/${project["project_name"]}/languages`).then((data) =>{
                document.getElementById("chart-container").innerHTML = `<canvas id="composition-${project.id}"></canvas>`
                createChart(data, project)
            }).catch((error) => {
                console.log("Github API Connection Error")
            })
            }).catch((error) => {
                console.log("Github API Connection Error")
            })
        })
    }).catch((error) => {
        console.log("Backend API Connection Error")
    })
})


function createChart(data, project){
    total = Object.values(data.data).reduce((x,y) => x+y)
    let percentageValues = []
    let i = 0
    for (let key in data.data){
        percentageValues.push(Math.round(data.data[key] / total * 100))
        i++;
    }
    Chart.defaults.color = "#fff"
    new Chart(document.getElementById(`composition-${project["id"]}`), {
        type: 'doughnut',
        indexLabel: "{label} #percent%",
        data: {
            labels: Object.keys(data.data),
            datasets:[
                {
                    label:"Percent of Total",
                    data:Object.values(percentageValues)
                }
            ]
        }
    })
}
