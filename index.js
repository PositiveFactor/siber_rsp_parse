var fs = require('fs')
var path = require('path')

function getFoldersList(destPath, filteredNames){
  filteredNames = filteredNames === undefined ? [] : filteredNames;
  return fs.readdirSync(destPath).filter(f => fs.statSync(path.join(destPath, f)).isDirectory() && filteredNames.indexOf(f) == -1);
}

function getFilesList(destPath, extensions){
  extensions = extensions === undefined ? [] : extensions;
  return fs.readdirSync(destPath).filter(f => fs.statSync(path.join(destPath, f)).isFile() && extensions.indexOf(f.split('.')[1]) >= 0);
}

function saveRspFiles(filename, dir){
	var rsps = [];
	fs.readFile(filename, (err, data)=>{
		if(err){
			console.log('err', err);
			return;
		}
		
		var sp = data.toString().split('\n')
		var startStr = '';
		sp.forEach(function(item){
			if(	item.startsWith('RESULT') || 
				item.startsWith('REALITY_CHECK_AFTER') || 
				item.startsWith('MESSAGE_TYPE')
			){
				startStr = item;
			}
			else if(item.startsWith('END')){
				rsps.push([startStr, item].join('\n'));
				startStr = '';
			}
		})
		
		// console.log(rsps);
		
		var index = 0;
		rsps.forEach(function(item){
			fs.writeFile(path.join(dir, 'rsp_' + index + '.txt'), item, function(err){
				if(err){
					console.log('err', err);
					return;
				}
			});
			index++;
		})
	})
}

function start(){
	var list = getFilesList('.', ['txt'])
	console.log(list);
	list.forEach( (f) => {
		let base = f.split('.')[0]
		let ext = f.split('.')[1]
		
		if (fs.existsSync(base)) {
			console.log(base, 'exist')
		}
		else {
			fs.mkdir(base);
			saveRspFiles(f, base);
		}
	})
}

start();