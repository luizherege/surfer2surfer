// This sample is using jso.js from https://github.com/andreassolberg/jso

var deviceready = function() {
    
    var debug = false,
        fbLogin = document.getElementById("fbLogin"),    
        inAppBrowserRef;
    
    jso_registerRedirectHandler(function(url) {
        inAppBrowserRef = window.open(url, "_blank");
        inAppBrowserRef.addEventListener('loadstop', function(e){LocationChange(e.url)}, false);
    });
    
    /*
* Register a handler that detects redirects and
* lets JSO to detect incomming OAuth responses and deal with the content.
*/
                
                function LocationChange(url){
                    
                    url = decodeURIComponent(url);
                    
                    
                    jso_checkfortoken('facebook', url, function() {
                        
                        inAppBrowserRef.close();
                    });
                };
                
                /* função logout */
                logOut = function ( )
                {
                    esvaziaProfile( );
                    var usr_nome = document.getElementById("usr_nome_txt");
                    while (usr_nome.firstChild) 
                    {
                        usr_nome.removeChild(usr_nome.firstChild);
                    }
                    
                    esvaziaFav( );
                    
                    localStorage.clear();
                    localStorage.setItem( 'TOKENS_ENSURED', 0 );
                    for ( var a = 0; a < ajax_all.length; a++ )
                    {
                        clearInterval( ajax_all[a] );
                        ajax_all[a] = null;
                    }
                    
                    $( "#feed_cont" ).hide( );
                    $( "#fav_refresh" ).hide( );
                    $( "#not_label" ).hide( );
                    $( "#not_check" ).hide( );
                    //$( "#anon_com" ).hide( );
                    //$( "#anon_com_label" ).hide( );
                    $( "#fav_button" ).hide( );
                    $( "#fb_post_label" ).hide( );
                    $( "#fb_post" ).hide( );        
                    
                    $("body").pagecontainer( "change", "#login_page" );       
                    
                };
                
                fbWallPost = function ( response ) 
                {        
                    if( document.getElementById("so_img").checked )
                    {
                        $.oajax({
                            type: "POST",
                            url: "https://graph.facebook.com/me/feed",
                            jso_provider: "facebook",
                            jso_scopes:  [ "publish_stream", "read_stream"  ],
                            jso_allowia: true,
                            dataType: 'json',
                            data: 
                            {
                                message: "Avaliação de praia: \nPraia/Cidade: "+response[0].praia_nome+"/"+response[0].cidade_nome+"\nNota : "+response[0].nota_texto+"\nTamanho das ondas: "+response[0].tam_onda+" M\nLink Foto: "+response[0].com_foto_url+"\nLink da Foto no Flickr Surfer2Surfer : "+response[0].com_foto_flickr,                
                                picture: response[0].com_foto_url
                            },
                            
                            success: function(data) 
                            { 
                                alert("Comentário enviado para o facebook com sucesso.")
                            },
                            
                            error: function(e) 
                            {
                                alert( JSON.stringify ( e ) );  
                            }
                        });
                        
                    }
                    
                    
                    else
                    { /*
            var post =
                [{
                    message: "Avaliação de praia: <center></center>Praia/Cidade: "+response[0].praia_nome+"/"+response[0].cidade_nome+"<center></center>Nota : "+response[0].nota_texto+"<center></center>Tamanho das ondas: "+response[0].tam_onda+" M<center></center>Comentário : "+response[0].com_conteudo+"<center></center>Link Foto: "+response[0].com_foto_url+"<center></center>Link da Foto no Flickr Surfer2Surfer : "+response[0].com_foto_flickr,                
                    picture: response[0].com_foto_url
                }]*/
            
        }
    }
    
    
    /*
* Configure the OAuth providers to use.
*/
    jso_configure({
        "facebook": {
            client_id: "137443023097520",
            redirect_uri: "http://www.facebook.com/connect/login_success.html",
            authorization: "https://www.facebook.com/dialog/oauth",
            presenttoken: "qs"
        }
    }, {"debug": debug});
                
                
                
                fbLogin.addEventListener("click", function() {
                    // For debugging purposes you can wipe existing cached tokens...
                    if( localStorage.getItem( "TOKENS_ENSURED" == 0 ) )
                    {
                        jso_ensureTokens({
                            "facebook": ["basic_info", "publish_stream", "email", "read_stream" ]
                        });
                        localStorage.setItem( "TOKENS_ENSURED" , 1 );
                    }
                    
                    $( "#fbLogin" ).addClass( 'ui-disabled' );
                    //$( "#anon_com" ).hide( );
                    //$( "#anon_com_label" ).hide( );        
                    $("body").pagecontainer("change", "#loading");
                    
                    $.oajax({
                        type: "GET",
                        url: "https://graph.facebook.com/me",
                        jso_provider: "facebook",
                        jso_scopes: [ "basic_info", "email" ],
                        jso_allowia: true,
                        dataType: 'json',
                        
                        success: function( basic ) 
                        { 
                            
                            $.oajax({
                                type: "GET",
                                url: "https://graph.facebook.com/"+ basic.id +"/?fields=picture",
                                jso_provider: "facebook",
                                jso_scopes: [ "basic_info" ],
                                jso_allowia: true,
                                dataType: 'json',
                                
                                success: function( picture_info ) 
                                {                        
                                    var json_usr_fb = 
                                        [
                                            {  
                                                "usr_nome": basic.name ,
                                                "usr_mail" : basic.email ,
                                                "fb_usr_id" : basic.id ,
                                                "usr_foto" : picture_info.picture.data.url
                                            }
                                        ];
                                    
                                    var fb_usr = JSON.stringify( json_usr_fb );
                                    
                                    $.ajax
                                    ({
                                        type: 'POST',
                                        crossDomain: true,
                                        url: 'http://surfer2surfer.com.br/cadastro_fb.php',
                                        data : fb_usr,
                                        success: function( response )
                                        {
                                            var json_logon_fb = 
                                                [
                                                    {  
                                                        "usr_login": basic.id ,
                                                        "usr_senha" : basic.id ,                                            
                                                    }
                                                ];
                                            var json_str = JSON.stringify( json_logon_fb );        			
                                            $.ajax
                                            ({
                                                type: 'POST',
                                                crossDomain: true,
                                                url: 'http://surfer2surfer.com.br/logon.php',
                                                data : json_str,
                                                success: function( data )
                                                {                            
                                                    var json_response = JSON.parse( data );                            
                                                    if( json_response[0].status == 0 )
                                                    {
                                                        alert(json_response[0].msg);
                                                        document.getElementById("logon_usr").value = "";
                                                        document.getElementById("logon_senha").value = "";
                                                        $( "#fbLogin" ).removeClass( 'ui-disabled' );
                                                        logOut ( );                                            
                                                    }
                                                    else
                                                    {                                
                                                        localStorage.setItem( 'USR_ID', json_response[0].usr_id );
                                                        localStorage.setItem( 'USR_NOME', json_response[0].usr_nome );
                                                        localStorage.setItem( 'USR_MAX_FAV', json_response[0].usr_max_fav );
                                                        localStorage.setItem( 'USR_PROC', json_response[0].usr_proc );                                           
                                                        
                                                        var json_fav = 
                                                            [
                                                                {  
                                                                    "usr_id": localStorage.getItem( 'USR_ID' )                                        
                                                                }
                                                            ];
                                                        
                                                        var json_fav_str = JSON.stringify( json_fav );
                                                        
                                                        $.ajax
                                                        ({
                                                            type: 'POST',
                                                            crossDomain: true,
                                                            url: 'http://surfer2surfer.com.br/json_lista_fav.php',
                                                            data : json_fav_str,
                                                            success: function( data )
                                                            {
                                                                var json_response_fav = JSON.parse( data );
                                                                var fav_array = new Array( );
                                                                
                                                                
                                                                for ( var i = 0; i < json_response_fav.length; i++ )
                                                                {
                                                                    var json_id_praia_fav = 
                                                                        [
                                                                            { "praia_id"	: json_response_fav[i].fav_praia }
                                                                        ];
                                                                    var json_id_praia_fav_str = JSON.stringify( json_id_praia_fav );
                                                                    
                                                                    fav_array[ json_response_fav[i].fav_praia ] = 1;
                                                                    
                                                                    ajax_lista_setInterval( json_id_praia_fav_str, parseInt( json_response_fav[i].fav_praia ) );
                                                                    ajax_call_lista( json_id_praia_fav_str, parseInt( json_response_fav[i].fav_praia ) );
                                                                }
                                                                
                                                                localStorage.setItem( "FAV_LIST", JSON.stringify( fav_array ) );
                                                                
                                                            },
                                                            error: function(jqXHR, textStatus, errorThrown) 
                                                            {
                                                                logOut( );
                                                                alert( "Erro com o ajax, reporte o erro ao dono do aplicativo.")
                                                            }
                                                        });                                            
                                                        
                                                        if( localStorage.getItem( "USR_PROC" ) == 1 )
                                                        {                                                
                                                            document.getElementById( "not_check" ).checked= true;
                                                            $( "#not_span").html("Recebendo Notificações");                                         
                                                        }
                                                        
                                                        else
                                                        {
                                                            document.getElementById( "not_check" ).checked = false;
                                                            $( "#not_span").html("Notificações Paradas"); 
                                                        }
                                                        
                                                        //$( "#fav_refresh" ).show( ).css( "display", "block" );                                           
                                                        //$( "#anon_com" ).hide( );
                                                        //$( "#anon_com_label" ).hide( );
                                                        $( "#not_label" ).show( );
                                                        $( "#not_check" ).show( ); 
                                                        $( "#fav_button" ).show( ).css( "display", "block" );
                                                        
                                                        
                                                        $("body").pagecontainer("change", "#user_panel");
                                                        $( "#not_check" ).checkboxradio( "refresh" );
                                                        document.getElementById("usr_nome_txt").appendChild( document.createTextNode( localStorage.getItem( 'USR_NOME' ) ) );
                                                        document.getElementById("logon_usr").value = "";
                                                        document.getElementById("logon_senha").value = "";
                                                        localStorage.setItem( "FB", 1 );
                                                        $( "#fbLogin" ).removeClass( 'ui-disabled' );
                                                        $( "#fb_post_label" ).show( );
                                                        $( "#fb_post" ).show( );                                                                                         
                                                    }
                                                    
                                                },
                                                error: function(jqXHR, textStatus, errorThrown) 
                                                {
                                                    logOut( );
                                                    alert( "Erro com o ajax, reporte o erro ao dono do aplicativo.");
                                                }
                                            });
                                            
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) 
                                        {
                                            logOut( );
                                            alert( "Erro com o ajax, reporte o erro ao dono do aplicativo.")
                                        }
                                    });
                                    
                                },
                                error: function(e) 
                                {
                                    logOut( );
                                    alert("Não foi possivel conectar-se ao facebook para aquisição de dados. Por favor verifique a conexão.");
                                    alert( JSON.stringify ( e ) ); 
                                }
                            });                
                        },
                        error: function(e) 
                        {
                            logOut( );
                            alert("Não foi possivel conectar-se ao facebook para aquisição de dados. Por favor verifique a conexão.");
                            alert( JSON.stringify ( e ) ); 
                        }
                    });
                });
                
            };


document.addEventListener('deviceready', this.deviceready, false);