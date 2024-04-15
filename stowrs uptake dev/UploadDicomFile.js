var _uploadId="";
var msggetStatus = document.getElementById("getStatus");

(function() {
let chunkCount = 0;
let chunkArray = []

var f = document.getElementById('f');
var msgid = document.getElementById("msg");
var msgstatusid = document.getElementById("status");
var msguploadId = document.getElementById("uploadId");
var base64UP="";
var orgId ="";
  var projectId = "";
  var endpoint = "";
msgid.innerHTML="Starting Upload"
if (f.files.length)
  getFileCount();

f.addEventListener('change', getFileCount, false);


function getFileCount(e) {
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
  var fileCount = f.files.length;
  var file = f.files[0];
  var size = file.size;
  startIntiate(fileCount,file.name,size);
  }

let count = 0;
async function processFile(e) {

  var fileCount = f.files.length;
  let type = 0;
  chunkCount++;

  //for(let i = 0 ; i<fileCount ; i++){
  chunkArray.push("started")
  let i = 0;
  var file = f.files[i];
    await send(file, fileCount, i,e,file.name,f.files);
  }
//}

async function send(piece,fileCount,count,uploadId,filename,files) {
  var formdata = new FormData();
  var xhr1 = new XMLHttpRequest();
  xhr1.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies/upload', true);
  xhr1.setRequestHeader('Authorization', 'Basic '+base64UP );
  formdata.append('file', piece);
  formdata.append('fileName', filename);
  formdata.append('count', count);
  formdata.append('uploadId', uploadId);
  formdata.append('chunkCount', fileCount);

 xhr1.onreadystatechange = () => {
   if (xhr1.readyState === 4) {
                msgstatusid.innerHTML="Upload In Progress"
      var obj = eval("(" + xhr1.response + ')');
      var obj1 = eval("(" + obj.body + ')');   
      msgid.innerHTML="Upload processing: "+obj1.currentCount+"/"+obj1.totalCount;
      console.log("current Count:"+obj1.currentCount+" status:"+obj1.uploadStatus)
      count = count + 1
      if(obj1.uploadStatus == "Completed"){
      console.log("completeUpload Triggered")
      completeUpload(chunkCount,uploadId);
      }else if(fileCount > count){
        file = files[count]
        send(piece,fileCount,count,uploadId,filename,files) 
      }
    }
  };
  xhr1.send(formdata);
}

function startIntiate(chunkCount,filename,size) {
  var offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("offset",offset);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies/intiateupload', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Basic '+base64UP );
   xhr.send(JSON.stringify({"count":chunkCount,"fileName":filename,filesize:size,"timeZone":offset}));
   xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      console.log(xhr.response);
       var obj = eval("(" + xhr.response + ')');
            console.log(obj);
            console.log(obj.body);
      var obj1 = eval("(" + obj.body + ')');    
       if(obj1.uploadId != undefined){
         processFile(obj1.uploadId);
         msgstatusid.innerHTML="Upload Started"
         msguploadId.innerHTML=obj1.uploadId;
         _uploadId=obj1.uploadId;
         }
      else
         msgid.innerHTML=obj1.errorMsg
         

    }
  };
}

function completeUpload(chunkCount,uploadId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies/completeupload', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Basic '+base64UP );
const json = {"count":chunkCount,"uploadId":uploadId};
   xhr.send(JSON.stringify(json));
   xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
            console.log(xhr.response);  
       console.log("Upload Completed")
       msgstatusid.innerHTML="Upload Completed"

    }
  };
}



})();

function getStatus(){

console.log("upload Id",_uploadId)
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
var base64UP = btoa(username+":"+password);
var orgId = document.getElementById("orgId").value;
var projectId = document.getElementById("projId").value;
var endpoint = document.getElementById("endpoint").value;
 console.log(username)
 console.log(password)
 console.log(base64UP)
 var offset = new Date().getTimezoneOffset();
console.log("offset",offset);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies/uploadstatus', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Basic '+base64UP );
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


function getProjects(){

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var base64UP = btoa(username+":"+password);
  var endpoint = document.getElementById("endpoint").value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint+'/projects', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', 'Basic '+base64UP );
  
     xhr.send();
     xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
              console.log(xhr.response);  
              var obj = eval("(" + xhr.response + ')');
       
        console.log("body",obj.body.projects[0].projectId)
        console.log("body",obj.body.projects[0].organizationId)
        console.log("body",obj.body.projects[0].projectName)

        document.getElementById("orgId").value = obj.body.projects[0].organizationId;
       document.getElementById("projId").value = obj.body.projects[0].projectId;
      
       document.getElementById("projName").innerHTML="Project Name :"+obj.body.projects[0].projectName;


  
      }
    };
  }

 