/**
 * Created by Vineeth on 29-05-2017.
 */

(function loaded(){
    $( '.preload-contain,#preLoader,#preBody' ).fadeOut( 500, function() {
        $('#preLoader,#preBody').remove();
    });
})();

