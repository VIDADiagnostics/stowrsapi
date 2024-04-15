var _uploadId="";
var msggetStatus = document.getElementById("getStatus");
(function() {
let chunkCount = 0;
let chunkArray = []

var f = document.getElementById('f');
var msgid = document.getElementById("msg");



msgid.innerHTML="Starting Upload"
if (f.files.length)
  getFileCount();

f.addEventListener('change', getFileCount, false);


function getFileCount(e) {
  var fileCount = f.files.length;
  var file = f.files[0];
  var size = file.size;
  processFile("test");
  }

let count = 0;
function processFile(e) {
  var fileCount = f.files.length;
  let type = 0;
  chunkCount++;

send(f.files[0], fileCount, 0,e,f.files[0].name);
setTimeout(loop, 10000);

 function loop() {
  for(let i = 1 ; i<fileCount ; i++){
  chunkArray.push("started")
  var file = f.files[i];
       send(file, fileCount, i,e,file.name);
  }

  }
}

function send(piece,fileCount,count,uploadId,filename) {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  orgId = document.getElementById("orgId").value;
  projectId = document.getElementById("projId").value;
  endpoint = document.getElementById("endpoint").value;
  base64UP = btoa(username+":"+password);
  console.log(username)
  console.log(password)
  console.log(base64UP)
  var offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("offset",offset);
  var formdata = new FormData();
  var xhr1 = new XMLHttpRequest();
  // xhr1.open('POST', 'https://9n7zdsqchk.execute-api.us-east-2.amazonaws.com/dev/4754c00f-29c8-45fc-8548-73ae929bc103/5b5246b2-cf3f-4cb5-9713-ebb8cce82530/stowrs/studies', true);
  xhr1.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies', true);

  xhr1.setRequestHeader('Authorization', 'Basic '+base64UP );
  //xhr1.setRequestHeader("Content-Type", "multipart/related;type='application/dicom'");
  formdata.append('content', piece);
  formdata.append('timeZone', offset);

  //formdata.append('fileName', filename);

 xhr1.onreadystatechange = () => {
   if (xhr1.readyState === 4) {
   
      console.log("completeUpload Triggered",xhr1.response)
      
      
    }
  };
  xhr1.send(formdata);
}

})();

function getStatus(){

console.log("upload Id",_uploadId)

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://9n7zdsqchk.execute-api.us-east-2.amazonaws.com/dev/4754c00f-29c8-45fc-8548-73ae929bc103/5b5246b2-cf3f-4cb5-9713-ebb8cce82530/stowrs/studies/uploadstatus', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Basic '+btoa("lokesh.bhatt+20@gmail.com:dev@Portal123$") );
const json = {"uploadId":_uploadId};
   xhr.send(JSON.stringify(json));
   xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
            console.log(xhr.response);  
            var obj = eval("(" + xhr.response + ')');
          var obj1 = eval("(" + obj.body + ')');  
      msggetStatus.innerHTML=obj1.status;

    }
  };
}
