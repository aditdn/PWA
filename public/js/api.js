const base_url = "https://api.football-data.org/v2/";
const endPointTeams = `${base_url}competitions/2021/teams`
const endPointMatches = `${base_url}competitions/2021/matches`
const fetchData = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      'X-Auth-Token': `b50e8e17325b4b1498567553a636a694`
    }
  })
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getTeam() {
  if ("caches" in window) {
    caches.match(endPointTeams).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var teamsHTML = "";
          data.teams.forEach(function (data) {
            teamsHTML += `
            <div class="col s12 m4">
                  <div class="team card">
                    <a href="./team.html?id=${data.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.crestUrl}" alt="${data.name}"/>
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${data.name}</span>
                    </div>
                  </div>
              </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        });
      }
    });
  }

  fetchData(endPointTeams)
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      var teamsHTML = "";
      data.teams.forEach(function (data) {
        teamsHTML += `
        <div class="col s12 m4">
              <div class="team card">
                <a href="./team.html?id=${data.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.crestUrl}" alt="${data.name}"/>
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${data.name}</span>
                </div>
              </div>
        </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            var detailTeam = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.crestUrl}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.name}</span>
                <p>Address : ${data.address}</p>
                <p>Telepon : ${data.phone}</p>
                <p>website :${data.website}</p>
              </div>
            </div>
          `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = detailTeam;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchData(base_url + "teams/" + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var detailTeam = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <p>Address : ${data.address}</p>
              <p>Telepon : ${data.phone}</p>
              <p>website : ${data.website}</p>
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = detailTeam;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedteams() {
  getAll().then(function (teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";
    teams.forEach(function (saved) {
      teamsHTML += `
              <div class="col s12 m4">
                  <div class="team card">
                    <a href="./team.html?id=${saved.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${saved.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                    <a class="btn-floating halfway-fab waves-effect waves-light red" id="deleted" onclick="deletedTeam(${saved.id})"><i class="material-icons">delete</i></a>
                  </a>
                      <span class="card-title truncate">${saved.name}</span>
                    </div>
                  </div>
              </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    if (!teamsHTML) {
      document.getElementById("save").innerHTML = `<p class="center">Tidak ada team disimpan</p>`;
    } else {
      document.getElementById("save").innerHTML = teamsHTML;
    }
  });
}

function getSavedArticleById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  getById(idParam).then(function (data) {
    detailSaved = '';
    var detailSaved = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <p>Address : ${data.address}</p>
              <p>Telepon : ${data.phone}</p>
              <p>website : ${data.website}</p>
            </div>
          </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = detailSaved;
  });
}

function getMatches() {
  if ("caches" in window) {
    caches.match(endPointMatches).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var matchHTML = "";
          data.matches.forEach(function (match) {
            matchHTML += `
            <div class="col s12 m4">
          <div class="card horizontal" style="height:180px">
              <div class="card-stacked">
                  <div class="col s12">
                      <p class="center">${match.season.startDate}</p>
                  </div>
                 <div class="row">
                      <div class="col s12 m5">
                          <p>${match.homeTeam.name}</p>
                      </div>
                      <div class="col s12 m2 center">
                          <p>Vs</p>
                      </div>
                  <div class="col s12 m4 right-align">
                      <p>${match.awayTeam.name}</p>
                  </div>
                          <p class="center"><strong>${match.status}</strong></p>
                </div>
              </div>
          </div>
      </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("matches-day").innerHTML = matchHTML;
        });
      }
    });
  }

  fetchData(endPointMatches)
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var matchHTML = "";
      data.matches.forEach(function (match) {
        matchHTML += `
        <div class="col s12 m4">
      <div class="card horizontal" style="height:180px">
          <div class="card-stacked">
              <div class="col s12">
                  <p class="center">${match.season.startDate}</p>
              </div>
              <div class="row">
                   <div class="col s12 m5">
                       <p>${match.homeTeam.name}</p>
                   </div>
                   <div class="col s12 m2 center">
                       <p>Vs</p>
                   </div>
               <div class="col s12 m4 right-align">
                   <p>${match.awayTeam.name}</p>
               </div>
                   <p class="center"><strong>${match.status}</strong></p>
              </div>
           </div>
       </div>
   </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("matches-day").innerHTML = matchHTML;
    })
    .catch(error);
}



