// npm config set init-module ~/.npm-init.js

var cp = require('child_process');

// 'npm init -y'命令
var temp = process.argv[3];
if (temp && temp == '-y') {
    module.exports = {
        "name": basename,
        "version": "0.1.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
    }

    return;
}

// ================================================
var projectname, githubname;
// var priv;

// 必须是对象字段, prompt才起作用, 方法里面没有用, 而且是按照从上到下顺序来提示的
module.exports = {
    // basename指向当前目录名称
    name: prompt('项目名称', basename || package.name, function (val) {
        return projectname = val || basename || package.name;
    }),

    version: prompt('版本号', '0.1.0', val => val),

    // 私有的好像有限制, 会创建失败
    /* private: prompt('私有的?', 'true', function (val) {
        return priv = (typeof val === 'boolean') ? val : !!val.match('true')
    }),*/

    creategit: prompt('github账号(创建github仓库)', '', function (val) {
        if (val) {
            console.log('\x1B[31m** 注意: 根目录下不要有.git目录 **\x1B[39m');

            githubname = val;

            console.log('输入github密码: ');
            // 命令: curl -u newchen https://api.github.com/user/repos -d '{"name": "testnpm"}'
            /* console.log("curl -u '" + githubname + "' https://api.github.com/user/repos -d " +
                "'{\"name\": \"" + projectname + "\", \"private\": " + ((priv) ? 'true' : 'false') + "}' ")*/

            // win平台不支持bash命令
            if (process.platform == 'win32') {
                console.log('暂不支持win平台, ~~')
                // git remote add origin https://github.com/${githubname}/${projectname}.git
            } else {
                cp.execSync(`
                    if [ -z $(ls -a | grep '.git') ]; 
                    then 
                        curl -u '${githubname}' https://api.github.com/user/repos -d '{"name": "${projectname}"}' 
                        git init
                        git remote add origin git@github.com:${githubname}/${projectname}.git
                    else
                        echo '请先删除.git目录'
                    fi`);
            }
            // cp.execSync('git remote add origin ' + 'https://github.com/' + githubname + '/' + projectname + '.git');
        }

        return undefined; // return undefined 就不会在package.json里面生成字段
    }),

    main: prompt('入口指向', 'index.js'),

    repository: {
        type: 'git',
        url: prompt('仓库url', '', function (val) {
            if (val) return val;

            if (githubname && projectname) {
                return 'git://github.com/' + githubname + '/' + projectname + '.git'
            }
        })
    },

    bugs: {
        url: prompt('bugs url', '', function (val) {
            if (val) return val;

            if (githubname && projectname) {
                return 'https://github.com/' + githubname + '/' + projectname + '/issues'
            }
        })
    },

    homepage: prompt('主页url', '', function (val) {
        if (val) return val;

        if (githubname && projectname) {
            return "https://github.com/" + githubname + "/" + projectname
        }
    }),

    keywords: prompt(function (s) {
        return s.split(/\s+/)
    }),

    license: 'ISC',

    scripts: {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    author: "",

    cleanup: function (cb) {
        cb(null, undefined)
    }

}