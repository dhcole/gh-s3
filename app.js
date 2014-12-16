var http = require('http'),
    exec = require('child_process').exec,
    p = require('path'),
    running = false,
    waiting = false,
    token = process.env.GITHUB_TOKEN,
    repo = process.env.S3_GH_REPO,
    branch = process.env.S3_GH_BRANCH,
    path = process.env.S3_GH_PATH,
    configFile = process.env.S3_GH_CONFIG,
    s3Publish = p.resolve(__dirname, 'node_modules/s3-publish/app.js');

// Command to run upon receiving webhook posts
var cmd = 'cd ' + path + ' && \
           git pull https://' + token + '@github.com/' + repo + '.git ' + branch + ' && \
           jekyll build && \
           node ' + s3Publish + ' ' + configFile;

server = http.createServer(function(req, res) {
  if (req.method === 'POST') {
    build();
    res.end('Thanks.');
  } else {
    res.end('Nope.');
  }
});
server.listen(process.env.PORT || 3001, '127.0.0.1');
console.log('Listening at http://127.0.0.1' + ':' + (process.env.PORT || 3001));

function build() {
  if (running) {
    waiting = true;
  } else {
    running = true;
    exec(cmd, function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      running = false;
      if (waiting) {
        waiting = false;
        build();
      }
    });
  }
}
