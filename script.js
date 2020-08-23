onload = function(){
    console.log("%cストップ！赤信号みんなで渡れば怖くない！",
  "color: red; font-size: 40px; font-weight: bold")
  console.log("%cもし誰かにここにコピペしろと言われたなら、あなたは11割騙されています。知らんけど",
  "font-size: 20px;")
  console.log("%cここに何かを貼り付けたら悪意のあるユーザーにあなたのアカウントを乗っ取られるかもしれません、知らんけど",
  "color: red; font-size: 20px; font-weight: 2px")
  console.log("%c自分が何をしているのか正確に理解していない限り、ウィンドウを閉じて安全にしているべきです。知らんけど",
  "font-size: 20px;")
  console.log("%c自分が何をしているのか正確に理解しているのなら、Discordに参加しましょう。てか参加しろ　by tetsu%o",
  "font-size: 20px;","https://discord.com/invite/pUSKJMa")
  console.log("%cあとこれ相当手抜きだからよろしくcss書くのめんどかった（）",
  "font-size: 20px;")
    // canvasエレメントを取得
    var c = document.getElementById('canvas');
    c.width = 500;
    c.height = 300;
    
    // webglコンテキストを取得
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    
    // 頂点シェーダとフラグメントシェーダの生成
    var v_shader = create_shader('vs');
    var f_shader = create_shader('fs');
    
    // プログラムオブジェクトの生成とリンク
    var prg = create_program(v_shader, f_shader);
    
    // attributeLocationを配列に取得
    var attLocation = new Array(2);
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');
    
    // attributeの要素数を配列に格納
    var attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;
    
    var position = new Array();
    var color = new Array();
    var index = new Array();
    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
    
    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
    
    // minMatrix.js を用いた行列関連処理
    // matIVオブジェクトを生成
    var m = new matIV();
    
    // 各種行列の生成と初期化
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());
    
    // ビュー×プロジェクション座標変換行列
    m.lookAt([0.0, 27.0, 50.0], [0, 17, 0], [0, 1, 0], vMatrix);
    m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);
    
    // カウンタの宣言
    var count = 0;
    
    // 恒常ループ
    (function(){
        // canvasを初期化
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        // カウンタをインクリメントする
        count++;
        
        // カウンタを元にラジアンを算出
        var rad = (count % 360) * Math.PI / 180;
        
        // モデル座標変換行列の生成(Y軸による回転)
        m.identity(mMatrix);
        m.rotate(mMatrix, rad, [0, 1, 0], mMatrix);
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        
        // インデックスを用いた描画命令
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        
        // コンテキストの再描画
        gl.flush();
        
        // ループのために再帰呼び出し
        setTimeout(arguments.callee, 1000 / 30);
        
    })();
    // シェーダを生成する関数
    function create_shader(id){
        // シェーダを格納する変数
        var shader;
        
        // HTMLからscriptタグへの参照を取得
        var scriptElement = document.getElementById(id);
        
        // scriptタグが存在しない場合は抜ける
        if(!scriptElement){return;}
        
        // scriptタグのtype属性をチェック
        switch(scriptElement.type){
            
            // 頂点シェーダの場合
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
                
            // フラグメントシェーダの場合
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }
        
        // 生成されたシェーダにソースを割り当てる
        gl.shaderSource(shader, scriptElement.text);
        
        // シェーダをコンパイルする
        gl.compileShader(shader);
        
        // シェーダが正しくコンパイルされたかチェック
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            
            // 成功していたらシェーダを返して終了
            return shader;
        }else{
            
            // 失敗していたらエラーログをアラートする
            alert(gl.getShaderInfoLog(shader));
        }
    }
    
    // プログラムオブジェクトを生成しシェーダをリンクする関数
    function create_program(vs, fs){
        // プログラムオブジェクトの生成
        var program = gl.createProgram();
        
        // プログラムオブジェクトにシェーダを割り当てる
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        
        // シェーダをリンク
        gl.linkProgram(program);
        
        // シェーダのリンクが正しく行なわれたかチェック
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
        
            // 成功していたらプログラムオブジェクトを有効にする
            gl.useProgram(program);
            
            // プログラムオブジェクトを返して終了
            return program;
        }else{
            
            // 失敗していたらエラーログをアラートする
            alert(gl.getProgramInfoLog(program));
        }
    }
    
    // VBOを生成する関数
    function create_vbo(data){
        // バッファオブジェクトの生成
        var vbo = gl.createBuffer();
        
        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        
        // バッファにデータをセット
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        
        // バッファのバインドを無効化
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        // 生成したVBOを返して終了
        return vbo;
    }
    
    // VBOをバインドし登録する関数
    function set_attribute(vbo, attL, attS){
        // 引数として受け取った配列を処理する
        for(var i in vbo){
            // バッファをバインドする
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            
            // attributeLocationを有効にする
            gl.enableVertexAttribArray(attL[i]);
            
            // attributeLocationを通知し登録する
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }
    
    // IBOを生成する関数
    function create_ibo(data){
        // バッファオブジェクトの生成
        var ibo = gl.createBuffer();
        
        // バッファをバインドする
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        
        // バッファにデータをセット
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        
        // バッファのバインドを無効化
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        // 生成したIBOを返して終了
        return ibo;
    }
    function createp(){
        var pos_vbo = create_vbo(position);
    var col_vbo = create_vbo(color);
    
    // VBO を登録する
    set_attribute([pos_vbo, col_vbo], attLocation, attStride);
    
    // IBOの生成
    var ibo = create_ibo(index);
    
    // IBOをバインドして登録する
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    }
    function createCube(origin, size){
        position.push(
            origin[0], origin[1] + size[1], origin[2], 
		    origin[0], origin[1] + size[1], origin[2] + size[2],   
		    origin[0] + size[0],origin[1] + size[1], origin[2] + size[2],   
		    origin[0] + size[0], origin[1] + size[1], origin[2],   

		// Left
		origin[0], origin[1] + size[1], origin[2] + size[2],    
		origin[0], origin[1], origin[2] + size[2],   
		origin[0], origin[1], origin[2], 
		origin[0], origin[1] + size[1], origin[2],   

		// Right
		origin[0] + size[0], origin[1] + size[1], origin[2] + size[2],   
		origin[0] + size[0], origin[1], origin[2] + size[2],   
		origin[0] + size[0], origin[1], origin[2], 
		origin[0] + size[0], origin[1] + size[1], origin[2],  

		// Front
		origin[0] + size[0], origin[1] + size[1], origin[2] + size[2],   
		origin[0] + size[0], origin[1], origin[2] + size[2],    
		origin[0], origin[1], origin[2] + size[2],   
		origin[0], origin[1] + size[1], origin[2] + size[2],   

		// Back
        origin[0] + size[0], origin[1] + size[1], origin[2],   
        origin[0] + size[0], origin[1], origin[2],    
		origin[0], origin[1], origin[2],   
		origin[0],  origin[1] + size[1], origin[2],    

		// Bottom
		origin[0], origin[1], origin[2],  
		origin[0], origin[1], origin[2] + size[2],    
		origin[0] + size[0], origin[1], origin[2] + size[2],     
        origin[0] + size[0], origin[1], origin[2],    
        )
        var setC = Math.round(Math.random() * 5)
        if(setC == 0){
            color.push(
                1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0,1.0, 0.0, 0.0, 1.0
                )
        }else if(setC == 1){
            color.push(
                0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,0.0, 1.0, 0.0, 1.0,
                )
        }else if(setC == 2){
            color.push(
                0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,0.0, 0.0, 1.0, 1.0,
                )
        }else if(setC == 3){
            color.push(
                1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,1.0, 1.0, 1.0, 1.0,
                )
        }else if(setC == 4){
            color.push(
                1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,1.0, 0.0, 1.0, 1.0,
                )
        }else if(setC == 5){
            color.push(
                1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,
                1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,
                1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,
                1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,
                1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,
                1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,1.0, 0.0, 1.0, 0.0,
                )
        }
        
        var leng = index.slice(-1)[0];
        if(leng == undefined){
            leng = 0;
        }
        else{
            leng += 1;
        }
        index.push(
            // Top
       leng,leng + 1,leng + 2,
       leng,leng + 2,leng + 3,

       // Left
       leng +5,leng + 4,leng + 6,
       leng +6,leng + 4,leng + 7,

       // Right
       leng +8,leng + 9,leng + 10,
       leng +8,leng + 10,leng + 11,

       // Front
       leng +13,leng + 12,leng + 14,
       leng +15,leng + 14,leng + 12,

       // Back
       leng +16,leng + 17,leng + 18,
       leng +16,leng + 18,leng + 19,

       // Bottom
       leng +21,leng + 20,leng + 22,
       leng +22,leng + 20,leng + 23
        )
        createp()
    }
    //https://360tetsu360.github.io/scaleResourcepack/chicken.geo.json
    //https://360tetsu360.github.io/scaleResourcepack/zombie.geo.json
    
    function jsonModel(data){
        
        if(Object.keys(data)[1] == "minecraft:geometry"){
            position = new Array()
            color = new Array()
            index = new Array()
            for (let par of data["minecraft:geometry"][0].bones) {
                if(par.cubes != undefined ){   
                    for (cu of par.cubes) {
                        if(cu.origin != undefined || cu.size != undefined){
                            createCube(cu.origin,cu.size)
                        }
                    }
                }
            }
        }
        else{
            //console.log(Object.values(data)[1].bones)
            if(Object.keys(data)[1].match(/geometry/)){
                position = new Array()
                color = new Array()
                index = new Array()
            //console.log(Object.keys(data)[1])
                for (let par of Object.values(data)[1].bones) {
                    if(par.cubes != undefined ){
                        for (cu of par.cubes) {
                            if(cu.origin != undefined || cu.size != undefined){
                                createCube(cu.origin,cu.size)
                            }
                        }
                    }
                }
            }
            else{
                window.alert('そういうのいらない\nモデルだけ')
            }
        }
    }
    lFile("#loadFile").onchange = function(evt){
        var file = evt.target.files[0];
        if(!file.type.match(/json/)){
            alert('テキストファイルを' + '選んで下さい');
            return;
    }
     
    var reader = new FileReader();
    reader.onload = function(evt) {
        jsonModel(JSON.parse(evt.target.result))
    }
     
    reader.readAsText(file, "Shift_JIS");
    }
     
    function lFile(id) {
        return document.querySelector(id);
    }
};
