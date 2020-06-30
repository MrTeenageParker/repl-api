/* global $ */

$(document).ready(function(){
    $('#logo').click(function(){
        window.location.href = "https://repl.mrparker.pw/";
    });
    
    $('#login').click(function(){
        window.location.href = "https://repl.mrparker.pw/login";
    });
    
    $('#logged_in_home').click(function(){
        window.location.href = "https://repl.mrparker.pw/languages";
    });
    
    $('#logged_in_account').click(function(){
        window.location.href = "https://repl.mrparker.pw/account";
    });
    
    // function for the search bar
    $('#submit').click(function(){
        var searchVal= document.getElementById("search").value;
        // var languages = [HTML, CSS, JAVASCRIPT, PYTHON3, RUBY, SCHEME, CSHARP, C#, JAVA, C, CPP, C++, CPP11, C++11, FSHARP, F#, GO, LUA, NODEJS, PHP, 
        // RUST, SWIFT, ESSIX, COFFEESCRIPT, ROY, APL, FORTH, QBASIC, BLOOP, BRAINF, EMOTICON, LOLCODE, UNLAMBDA];
        
        switch (searchVal.toUpperCase()) {
            case "C#":
                searchVal = "csharp";
                break;
            case "CPP":
                searchVal = "c_cpp";
                break;
            case "CPP11":
                searchVal = "c_cpp";
                break;
            case "HTML, CSS, JS":
                searchVal = "htmlcssjs";
                break;
            case "Python(with turtle)":
                searchVal = "pyuthonwithturtle";
                break;
            case "ES6":
                searchVal = "essix";
                break;
        }
        
        var location = ["/languages/", searchVal].join('');
        
        window.location.href = location;
    });
    
    if(window.location.href.indexOf("/languages/") == -1){
        //Autocomplete functionality for the search bar on the Languages page.
        $("#search").autocomplete({
            source: ["HTML", "CSS", "JAVASCRIPT", "PYTHON3", "RUBY", "SCHEME", "CSHARP", "C#", "JAVA", "C", "CPP", "C++", "CPP11", 
            "C++11", "FSHARP", "F#", "GO", "LUA", "NODEJS", "PHP", "RUST", "SWIFT", "ESSIX", "COFFEESCRIPT", "ROY", "APL", "FORTH", 
            "QBASIC", "BLOOP", "BRAINF", "EMOTICON", "LOLCODE", "UNLAMBDA", "Python(with turtle)", "HTML, CSS, JS"]
        });
        
        //Accordian functionality for language list on the Languages page.
        $("#languages").accordion();
    } else {
        //console.log('nothing to see here');
    }
    
    //Rsizable window functionality for the editor.
    $( "#editor" ).resizable({
        minWidth: 200,
        minHeight: 200,
        containment: "#container",
        handles: "e"
    });
    
    $( "#console" ).resizable({
        minWidth: 200,
        minHeight: 200,
        containment: "#container",
        handles: "w"
    });
});
