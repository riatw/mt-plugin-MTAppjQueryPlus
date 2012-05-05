/*
 * MTAppjQueryPlus (Movable Type Plugin)
 *
 *
 * Since:   2010-08-29
 * Update:  2010-08-29
 * for version: 0.10
 * Comment: 各機能をプラグイン化
 * 
 */

/* ブログ記事アイテムの並び替え機能 */
(function($){
	$.MTAppEntryAssetsSort = function(){
		
		if($('body').is("#edit-entry")){
			var assetlist = $("#asset-list");
			var tag_value = "";
			var asset_id;
			
			//ブログ記事投稿画面を開いた際に、並び順の反映
			array = $("#tags").val().split("##");
			
			$.each(array,function(){
				asset_id = "#asset-list li#" + "list-asset-" + this;
				$(asset_id).appendTo("#asset-list");	
			});

			//ブログ記事アイテムの並び替えを有効にする
			assetlist.sortable();
			$("li",assetlist).css("cursor","pointer");
			
			//ブログ記事保存時に並び替え順序を保存
			$("form#entry_form").submit(function(){
				$("#asset-list li").each(function(i){
					tag_value = tag_value + $(this).attr("id").replace("list-asset-","");
					if(i >= 0){
					tag_value = tag_value + "##";
					}
				});
				
				//並び順の保存先の指定（初期値はタグの部分に並び順を＃＃区切りで格納）
				$("#tags").val(tag_value);
			});
		}
	}
})(jQuery);


/* ファイルのアップロード時のファイル名のバリデート */
(function($){
	$.MTAppUploadValidater = function(){
		$("#file").change(function(){		
			str=this.value;
			
			str = str.substring(str.lastIndexOf("\\")+1, str.length);
					
			/* 半角英数字(0-9)、四則演算子(+-/*)、ピリオド(.)、カンマ(,)のみ */
			var tmp=str.match(/[0-9a-zA-Z\-\_\,\.]+/g);
			
			var upload_asset_dialog = $("#upload-asset-dialog #upload-form .actions-bar button.upload");
			
			/* matchメソッドの返り値が入力値と等しい場合は、全て半角 */
			if (tmp!=str){
				//ファイル名が不正だったら、アップロードボタンを無効にする
				upload_asset_dialog.attr("disabled","disabled")
				upload_asset_dialog.removeClass("primary-button");		
				alert("ファイル名に日本語、又は半角スペース・無効な記号等が含まれています。\n半角英数字のみに変更してアップロードして下さい。");
				return false;
				
			}else{
				//ファイル名が正常だったら、アップロードボタンを有効にする
				upload_asset_dialog.attr("disabled","")
				upload_asset_dialog.addClass("primary-button");		
				return true;
			}
		});
	}
})(jQuery);


/* ブログ記事の並び替え機能　注:公開日を書き換えます */
/* 必要なライブラリ:jQuery.Sortable 日付を上書きするので、新着情報には使用不可 */
(function($){
    $.MTAppEntrySort = function(){
		var batch_edit_entry = $("#batch-edit-entry");	
		var action_bar_top = $("#actions-bar-top button",batch_edit_entry);	
		
		$("#entry-listing-table tbody",batch_edit_entry).sortable();
		
		$(action_bar_top).html("保存と並び替えをする");
		$(action_bar_top).attr("title","保存と並び替えをする");
		
		var TODAY = new Date();
		
		$(action_bar_top).click(function(){
			$("#entry-listing-table td.datetime input").each(function(i){
				// 日付を組み立てる（1件ごとに1分ずらした時間をセットする）
				TODAY.setTime(TODAY.getTime() - 60 * 1000 * i);
				
					var YYYY = TODAY.getFullYear(); // 4桁西暦年
					var M    = TODAY.getMonth()+1;  // 1桁月
					var MM   = TODAY.getMonth()+1;  // 2桁月
					if(M < 10) MM = "0" + M;
					var D    = TODAY.getDate();     // 1桁日
					var DD   = TODAY.getDate();     // 2桁日
					if(D < 10) DD = "0" + D;
					h = TODAY.getHours(); if(h<10) h="0"+h; else if(h == 24) h="00";
					s = TODAY.getMinutes();  if(s<10) s="0"+s; else if(s == 0) h="00";
					sec = TODAY.getSeconds();  if(sec<10) sec="0"+sec; else if(sec == 0) sec="00";
				
				// 出力
				var temp = YYYY+'-'+MM+'-'+DD+'  '+h+':'+s+':'+sec;
				
				$(this).val(temp);
			});		
		});
	}
})(jQuery);


 (function($){
    $.fn.MTAppTableConverter = function(options){
        var op = $.extend({colcnt  : 2},options || {}); // optionsに値があれば上書きする

		var customfield = $(this);
		
		//列数
		var colcnt = op.colcnt;
		
		//テーブルの基本HTML　テーブル+行の追加ボタン
		var basehtml = '<table class="listing view MTAppTableConverter" style="table-layout:fixed;width:100%;margin:0px 0 0 0"><thead>' + op.thead + '</thead><tbody></tbody></table><br /><input type="button" class="add" value="項目を追加する" />';
		
		//削除ボタンのhtml
		var removebtn = '<td style="text-align:center;width:30px;"><input type="button" class="remove" value="-" /></td></tr>';

		//処理対象のフィールドのwrapper
		var target = customfield.parent();

		//元のテキストエリアを隠す
		customfield.css("display","none");
				
		//***初回実行（ページを開いたとき）テキストエリアからテーブル生成***//
		//とりあえずクリーニング
		var target = customfield.parent();
		target.find("table").remove().end().find("input.add").remove();

		//基本的なHTMLをまず入れる。
		customfield.after(basehtml);
		
		//対象のフィールドが空だったら、初期値を入れる
		if(customfield.val() == ""){
			customfield.text(op.preset);
		}
		
		var rowdata = customfield.val().replace(/[\n\r][\n\r]?/g, "\n").split("\n");
		
		//処理対象テーブルの指定（基本変更不要）
		//var tbl = target.find("table");
		var tbl = customfield.next();
		
		var tbody = tbl.find("tbody");
		var buff;
		
		//投稿画面表示時に、テキストエリア→テーブルに変換する
		for(rowcnt=0;rowcnt<rowdata.length;rowcnt++)
		{
			if(rowdata[rowcnt] != ""){
				coldata = rowdata[rowcnt].split('##');
				rowbuff = "<tr>";
				if(coldata.length > 0){
					for(colcnt=0;colcnt<coldata.length;colcnt++){
						coldata[colcnt] = coldata[colcnt].replace(/<br \/>/g, "\n");
						
						//テキストかテキストエリアかで処理を分岐
						if(op.type == "text"){
							rowbuff+= '<td><input type="text" value="'+ coldata[colcnt] +'" style="width:100%" />';
						}
						else{
							rowbuff+= '<td><textarea style="width:100%">'+ coldata[colcnt] +'</textarea>';
						}
					}
					rowbuff+= removebtn;
					//tbl.append(rowbuff);
					buff += rowbuff;
				}
			}
		}
		tbl.append(buff);
		
		//テーブルの行の入れ替えを実装
		$("tbody",tbl).sortable();
		//行の入れ替えが伝わるように、マウスポインタを変更
		$("tbody",tbl).css("cursor","pointer");
	
	
	//***ブログ記事保存時に、テーブル→テキストエリアにデータを書き出す***//
	$("form#entry_form").submit(function(){
		var rowbuff =[];
		
		$("tr",tbody).each(function(){
			var rowarray = [];
			
			$("input[class!=remove],textarea",this).each(function(){
				rowarray.push($(this).val().replace(/\n/g, "<br />"));
			});
			
			rowbuff.push(rowarray.join("##"));
		});
		
		customfield.val(rowbuff.join("\n"));
	});
	
	//***行の削除処理***//
	$("input.remove").live('click', function() {
		$(this).parent().parent().remove();
	});
	
	//***行の追加処理***//
	$("input.add",target).click(function(){
		rowdata = "<tr>";
		
		for (i = 0; i < op.colcnt; i = i +1){
			if(op.type == "text"){
				rowdata+= '<td><input type="text" /></td>';
			}
			else{
				rowdata+= '<td><textarea style="width:100%"></textarea></td>';
			}
		}
		rowdata+= removebtn;
		
		$(tbl).append(rowdata);
	});

}

})(jQuery);


 (function($){
    $.fn.MTAppMultiConverter = function(options){
        var op = $.extend({},options || {}); // optionsに値があれば上書きする

		var customfield = $(this);
		
		//元のテキストエリアを隠す
		customfield.css("display","none");
		//とりあえずクリーニング
		var target = customfield.parent();
		target.find("table").remove().end().find("input.add").remove();
		
		//基本的なHTMLをまず入れる。
		customfield.after(op.tbody);
		var rowdata = customfield.text().replace(/[\n\r][\n\r]?/g, "\n").split("\n");
		
		//処理対象テーブルの指定（基本変更不要）
		tbl = target.find("table");
		trhtml = tbl.find("tbody").find("tr").clone(true);
		
		if(rowdata.length > 1){
			for(rowcnt=0;rowcnt<rowdata.length;rowcnt++)
			{
				//行を複製
				if(rowcnt != 0){
					tbl.find("tbody").append(trhtml.clone());
				}
				
				//処理対象の行
				attach = tbl.find("tbody").find("tr:last-child");
				//行のデータ(json)をオブジェクトに変換
				coldata = $.evalJSON(rowdata[rowcnt]);
				
				//クラス名を頼りに要素に値をセットしていく
				for(var key in coldata){
					if(coldata[key] != ""){
						var current = "." + key;
						$(current,attach).val(coldata[key].replace(/<br \/>/g, "\n"));
						$(current,attach).attr("src",coldata[key]);
					}
				}
			}
		}
		
		//テーブルの行の入れ替えを実装
		$("tbody",tbl).sortable();
		//行の入れ替えが伝わるように、マウスポインタを変更
		$("tbody",tbl).css("cursor","pointer");
	

		//***ブログ記事保存時に、テーブル→テキストエリアにデータを書き出す***//
		$("form#entry_form").submit(function(){
			var tbody = customfield.parent().find("table").find("tbody");
			var savebuff = [];
			
			$("tr",tbody).each(function(i){
				var colbuff = {};
				
				$("input,select,textarea",this).not(".remove").each(function(){
					var c = $(this).attr("class");
					colbuff[c] = $(this).val();
				});
				savebuff.push($.toJSON(colbuff));
			});
			
			customfield.val(savebuff.join("\n"));
		});
		
		//***行の追加処理***//
		$("input.add",target).click(function(){
			var tbl = $(this).parent().find("table");
			tbl.append(trhtml.clone(true));
		});
		
		//***行の削除処理***//
		$(".MTAppMultiConverter input.remove").live('click', function(e) {
			$(this).parent().parent().remove();
		});
		
		/* 機能：画像表示のイベントヒモ付 */
		/* 画像をクリックした時の処理 */
		$(".MTAppMultiConverter input.image").live('click', function(e) {
			var iv = $("#imageviewer");
			
			iv.css("top",e.pageY -100);
			iv.css("left",e.pageX + 50);
			iv.show();
			tmp_id = $(this);
			return false;
		});

	}

})(jQuery);


 (function($){
    $.MTAppsetImageviewer = function(options){
        var op = $.extend({},options || {}); // optionsに値があれば上書きする
	
		// ブログIDを取得
		var blogId = $('#blog-id').val();
		if(blogId == undefined){
			blogId = $('input[name="blog_id"]').val();
		}
		
		//ブログIDを整数に変換
		blogId = parseInt(blogId);
	
		/* 機能：#imageviewerの読み込み、各種動作の定義 */
		//#imageviewerの読み込み
		$.ajaxSetup({ cache: false }); //false
		$.ajaxSetup({ ifModified: false });
	
		$.ajax({
			url: op.url,
			method: "get",
			dataType: "text",
			data: "__mode=initialize&_type=asset" + "&blog_id=" + blogId,
			success: function(data) {
				//読み込み終わったら、とりあえずbodyに要素を仕込む
				$("body").prepend(data);
				
				//初期化
				var iv = $("#imageviewer");
				var offset = 0;
		
				//最初の10件を入れる
				getAssetList(offset);
				
				//#imageviewerの各種イベントを設定していく
				
				/* メニューバーをクリックしたときの処理(クラス名によって処理を分岐） */
				$("ul.ctr li a",iv).click(function(){
					//閉じる
					if($(this).hasClass("close")){
						iv.hide();
						return false;
					}
					//選択解除
					else if($(this).hasClass("clear")){
						tmp_id.val("");
						tmp_id.attr("src","mt-static/plugins/MTAppjQueryPlus/image_select_default.jpg");
						iv.hide();
						return false;
					}
					//複数アップロード
					else if($(this).hasClass("upload")){
						iv.hide();
						return true;
					}
					//再読み込み
					else if($(this).hasClass("refresh")){
						$("ul.view",iv).empty();
						offset = 0;
						getAssetList(offset);
						return false;
					}
				});
				
				/* スクロール時に画像の追加読み込み処理(Ajax) */
				$("ul.view",iv).scroll(function(){
					var scrolltop=$(this).attr('scrollTop');
					var scrollheight=$(this).attr('scrollHeight');
					var windowheight=$(this).attr('clientHeight');
					var scrolloffset=50;
					if(scrolltop>=(scrollheight-(windowheight+scrolloffset)))
					{
						offset = offset + 10;
						getAssetList(offset);
					}
				});
	
				/* 画像をクリックしたときの処理 */
				$("ul.view li a",iv).live('click', function(e) {
					tmp_id.val($("img",this).attr("src"));
					tmp_id.attr("src",$("img",this).attr("src"));
					iv.hide();
					return false;
				});
			}
		});
	
		/* 画像を動的に読み込む関数 */
		function getAssetList(offset){
			var iv = $("#imageviewer");
			
			$.ajaxSetup({ cache: false }); //false
			$.ajaxSetup({ ifModified: false });
			
			$.ajax({
				url: op.url,
				method: "get",
				data: "__mode=ajax&_type=asset" + "&offset=" + offset + "&lastn=10" + "&blog_id=" + blogId,
				dataType: "text",
				success: function(data) {
					$("ul.view",iv).append(data);
				}
			});
		}
	}
})(jQuery);


/*
	単一行テキストのフィールドをカレンダー風のUIに変更するjs
	jquery.calendar-min.jsを使用させていただいていますm(__)m
*/
 (function($){
    $.fn.MTAppCalenderSelector = function(options){
		var customfield = $(this);

		//元のテキストエリアを隠す
		customfield.css("display","none");

		//とりあえずクリーニング
		var target = customfield.parent();
		$("div",target).remove();

		if($('body').is("#edit-entry")){
			/* field_buff = カレンダーで選択した日付（カンマ区切り） */
			var field_buff = customfield.val().split(",");
			
			/* 公開日から対象の年と月を抽出する */
			var date_buff = $("#created-on").val().split("-");
			
			/* カレンダー表示設定 */
			customfield.parent().calendar({
				caption: '%Y-%m',
				year: date_buff[0],
				month: Number(date_buff[1]),
				addDay: function(td) {
					td.html(this.day);
					//既に選択している日は、class="selected" をつける
					if ($.inArray(td.text(), field_buff) != -1) {
						td.addClass("selected");
					}
					//カレンダーのセルのクリックイベントを設定
					td.click(function(){
						$(this).toggleClass("selected");
					});
				},
				beforeMove: function(option,yearmonth) {
					/* 月が変わったら、データをクリア */
					customfield.val("");
					field_buff = "";
				}
			});
			
			//***ブログ記事保存時に、カレンダーで選択した日を書き出す***//
			$("form").has(customfield).submit(function(){
				var rowbuff = [];
								
				if(customfield != ""){
					//選択した日付の保存
					$("td.selected",target).each(function(){
						rowbuff.push($(this).text());
					});
					customfield.val(rowbuff.join(","));
					
					//カレンダーのキャプション+日付で公開日に現在の月を保持する
					$("#created-on").val($("div.caption",target).text() + "-01");
					
					//タイトルが未入力だったら、xxxx-xxのカレンダーと表示
					$("#title").val($("div.caption",target).text() + "のカレンダー");
				}
				
			});	
		}
		
	}

})(jQuery);


/*
	テキスト(単1行)をセレクトボックスのUIに変更するjs
*/
 (function($){
    $.fn.MTAppSelectBox = function(options){
        var op = $.extend({},options || {}); // 初期値設定(op.label)
		
		var array = op.label.split(',');

		var customfield = $(this);
		var customfield_content = $(this).parent();
		var customfield_val = $(this).val();
		
		customfield = customfield.replaceWith('<select name="' + $(this).attr("name") + '"></select>');
		//再取得
		customfield = customfield_content.find("select");
		
		var rowbuff = "";
		//投稿画面表示時に、テキストエリア→テーブルに変換する
		for(i=0;i<array.length;i++)
		{
			rowbuff+= '<option value="'+ array[i] +'">' + array[i] +'</option>';
		}
		
		//optionを入れる
		customfield.append(rowbuff);
		
		//値をセット
		customfield.val(customfield_val);
	}

})(jQuery);


/* Youtubeの閲覧用URLからプレビュー画面を作成する
	options.view = img/iframe
	options.auto = 1/0 (画面リロード時に前回の値を復元するか)
*/
(function($){
	$.fn.MTAppYoutubePreview = function(options){
        var op = $.extend({view  : "img"},options || {});
		
		$(this).keyup(function(){
			function getGetValue(target,key) {
				var value	= null;
				var query	= target;
				var params	= query.split('&');
				for ( var i = 0; i < params.length; i++ ) {
					var item	= params[i].split('=');
					if ( key == item[0] ) {
						value = decodeURI(item[1]);
						break;
					}
				}
				return value;
			}
			
			//処理対象
			var target = $(this).parent();
			
			//Youtubeのembed、imgのURLを指定(仕様変更があった場合はここを変更)
			var embedurl = "http://www.youtube.com/embed/";
			var thumurl = "http://img.youtube.com/vi/";
			
			//URLとして、閲覧用のURLが貼られた場合は変換
			if($(this).val().indexOf("watch") > -1){
				$(this).val(embedurl + getGetValue($(this).val().split("?").pop() ,"v"));
			}
			
			//前に生成した画像を削除
			target.find(op.view).remove();
			
			if(op.view == "img"){
				//Youtubeのサムネイルを生成
				$("<img />")
				.attr("src",thumurl + $(this).val().split("/").pop() + "/0.jpg")
				.css({"width":"200px","margin-bottom":"10px"}).prependTo(target);
			}
			else{
				//Youtubeのサムネイルを生成
				$("<iframe />")
				.attr("src",$(this).val())
				.css({"width":"300px","height":"182px","margin-bottom":"10px"})
				.attr("frameborder",0)
				.prependTo(target);
			}
		});
		
		if(op.auto == 1){
			if($(this).val()){
				$(this).keyup();
			}
		}

	}
})(jQuery);




