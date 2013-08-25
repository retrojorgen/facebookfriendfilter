/** Rename this to config.js and change baseUrl path **/

requirejs.config({
    baseUrl : 'src/scripts/lib',
    paths : {
      app : '../app',
      jquery  : '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
      'facebook': '//connect.facebook.net/en_US/all'
    },
    shim: {
        'facebook' : {
            export: 'FB'
        }
    }
});

requirejs(['app/main', 'app/fb']);
