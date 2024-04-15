var _uploadId="";
var msggetStatus = document.getElementById("getStatus");
(function() {
var f = document.getElementById('f');
var msgid = document.getElementById("msg");
var msgstatusid = document.getElementById("status");
var msguploadId = document.getElementById("uploadId");
var projName = document.getElementById("projName");


var base64UP="";
var orgId ="";
  var projectId = "";
  var endpoint = "";
msgid.innerHTML="Starting Upload"
var chunkCount = 0;
var chunkArray = []

if (f.files.length){
  getChunkCount();
  }
  
f.addEventListener('change', getChunkCount, false);

function getChunkCount(e) {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  orgId = document.getElementById("orgId").value;
  projectId = document.getElementById("projId").value;
  endpoint = document.getElementById("endpoint").value;

   base64UP = btoa(username+":"+password);

   console.log(username)
   console.log(password)
   console.log(base64UP)
chunkArray=[];
chunkCount=0;
count=0;
  var file = f.files[0];
  var size = file.size;
  var sliceSize = 4000000;
  var start = 0;
  setTimeout(loop, 1);
  function loop() {
    var end = start + sliceSize;
    if (size - end < 0) {
      end = size;
    }
chunkCount++;
chunkArray.push("started")
    if (end < size) {
      start += sliceSize;
      setTimeout(loop, 1);
    }else{
          startIntiate(chunkCount,file.name,size);
          }
  }
}
let count = 0;
function processFile(e) {
  var file = f.files[0];
  var size = file.size;
  var sliceSize = 4000000;
  var start = 0;

  setTimeout(loop, 1);

  function loop() {
    var end = start + sliceSize;
    if (size - end < 0) {
      end = size;
    }
    var s = slice(file, start, end,count);
    count++;
    send(s, start, end, count,e);

    if (end < size) {
      start += sliceSize;
      setTimeout(loop, 3000);
    }
  }
}

function send(piece, start, end,count,uploadId) {
  var formdata = new FormData();
  var xhr1 = new XMLHttpRequest();
  xhr1.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies/upload', true);
  xhr1.setRequestHeader('Authorization', 'Basic '+base64UP );
  formdata.append('file', piece);
  formdata.append('fileName', f.files[0].name);
  formdata.append('count', count);
  formdata.append('uploadId', uploadId);
  formdata.append('totalCount', chunkCount);
 xhr1.onreadystatechange = () => {
 if (xhr1.readyState === 4) {
                 msgstatusid.innerHTML="Upload In Progress"
     var obj = eval("(" + xhr1.response + ')');
      var obj1 = eval("(" + obj.body + ')');   
      msgid.innerHTML="Upload processing: "+obj1.currentCount+"/"+obj1.totalCount;
      console.log("current Count:"+obj1.currentCount+" status:"+obj1.uploadStatus)
      if(obj1.uploadStatus == "Completed"){
      completeUpload(chunkCount,uploadId);
            console.log("completeUpload Triggered")
    }
    }
  };
  xhr1.send(formdata);
}

function startIntiate(chunkCount,filename,size) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint+'/'+projectId+'/'+orgId+'/stowrs/studies/intiateupload', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Basic '+base64UP );
  var offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("offset",offset);
  xhr.send(JSON.stringify({"count":chunkCount,"fileName":filename,filesize:size,"timeZone":offset}));
  
   //xhr.send(JSON.stringify({"count":chunkCount,"fileName":filename,filesize:size}));
   xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      console.log(xhr.response);
       var obj = eval("(" + xhr.response + ')');
      var obj1 = eval("(" + obj.body + ')');    
      if(obj1.uploadId != undefined){
                      msgstatusid.innerHTML="Upload Started"
                      msguploadId.innerHTML=obj1.uploadId;
                               _uploadId=obj1.uploadId;
         processFile(obj1.uploadId);
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
  xhr.setRequestHeader('InvocationType', 'Event' );

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
function noop() {}


function slice(file, start, end) {
  var slice = file.mozSlice ? file.mozSlice :
              file.webkitSlice ? file.webkitSlice :
              file.slice ? file.slice : noop;
 return slice.bind(file)(start, end);
}

})();

function getStatus(){
console.log("upload Id",_uploadId)
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
 base64UP = btoa(username+":"+password);
 var orgId = document.getElementById("orgId").value;
var projectId = document.getElementById("projId").value;
var endpoint = document.getElementById("endpoint").value;
 console.log(username)
 console.log(password)
 console.log(base64UP)
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
    // xhr.open('GET', 'https://znoxv2atk6.execute-api.us-east-2.amazonaws.com/prod/projects', true);
    //   xhr.setRequestHeader("Content-Type", "application/json");
    //   xhr.setRequestHeader('Authorization', 'Basic '+btoa("lokesh.bhatt+1@gmail.com:@iurREsdsd34#$") );
   
     xhr.send();
     xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
              console.log(xhr.response);  
              var obj = eval("(" + xhr.response + ')');
            // var obj1 = eval("(" + obj.body + ')');  
        // msggetStatus.innerHTML=obj1.status;
        console.log("body",obj.body.projects[0].projectId)
        console.log("body",obj.body.projects[0].organizationId)
        console.log("body",obj.body.projects[0].projectName)

        document.getElementById("orgId").value = obj.body.projects[0].organizationId;
       document.getElementById("projId").value = obj.body.projects[0].projectId;
      
       document.getElementById("projName").innerHTML="Project Name :"+obj.body.projects[0].projectName;


  
      }
    };
  }

 