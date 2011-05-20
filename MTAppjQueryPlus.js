/*
 * MTAppjQueryPlus (Movable Type Plugin)
 *
 *
 * Since:   2010-08-29
 * Update:  2010-08-29
 * for version: 0.10
 * Comment: 各機能をプラグイン化
 * 
 */a


/* ブログ記事アイテムの並び替え機能 */
(function($){
	$.MTAppEntryAssetsSort = function(){
		if($('body').is("#edit-entry")){
			
			//ブログ記事投稿画面を開いた際に、並び順の反映
			$("#asset-list").clone().prependTo("#footer");
			$("#asset_container #asset-list").empty();
			array = $("#tags").val().split("##");
			$.each(array,function(){
				//temp4 = "";
				temp4 = "#footer #asset-list li#" + "list-asset-" + this;
				$(temp4).appendTo("#asset_container #asset-list");	
			});
			$("#footer #asset-list").empty();
		
			//ブログ記事アイテムの並び替えを有効にする
			$("#asset-list").sortable();
			$("#asset-list li").css("cursor","pointer");
			
			//ブログ記事保存時に並び替え順序を保存
			$("form#entry_form").submit(function(){
			
				//temp = "";
				temp2 = "";
				
				$("#asset-list li").each(function(i){
					temp2 = temp2 + $(this).attr("id").replace("list-asset-","");
					if(i >= 0){
					temp2 = temp2 + "##";
					}
				});
				
				//並び順の保存先の指定（初期値はタグの部分に並び順を＃＃区切りで格納）
				$("#tags").val(temp2);
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
			//var tmp=str.match(/[0-9a-zA-Z\-\_\,\. ]+/g);
			
			/* 半角英数字(0-9)、四則演算子(+-/*)、ピリオド(.)、カンマ(,)のみ */
			var tmp=str.match(/[0-9a-zA-Z\-\_\,\.]+/g);
			
			/* matchメソッドの返り値が入力値と等しい場合は、全て半角 */
			if (tmp!=str){
				//もしファイル名に問題があったら、フォームを初期化する(予定)
				$("#upload-asset-dialog #upload-form .actions-bar button.upload").attr("disabled","disabled")
				$("#upload-asset-dialog #upload-form .actions-bar button.upload").removeClass("primary-button");		
				//alert("画像のファイル名に、全角文字が含まれています。ファイル名を変更してからアップロードしてください。");
				alert("ファイル名に日本語、又は半角スペース・無効な記号等が含まれています。\n半角英数字のみに変更してアップロードして下さい。");
				
				return false;
			}else{
				$("#upload-asset-dialog #upload-form .actions-bar button.upload").attr("disabled","")
				$("#upload-asset-dialog #upload-form .actions-bar button.upload").addClass("primary-button");		
				return true;
			}
		});
	}
})(jQuery);


/* ブログ記事の並び替え機能　注:公開日を書き換えます */
/* 必要なライブラリ:jQuery.Sortable 日付を上書きするので、新着情報には使用不可 */
(function($){
    $.MTAppEntrySort = function(){	
		$("#batch-edit-entry #entry-listing-table tbody").sortable();
		
		$("#batch-edit-entry #actions-bar-top button").html("保存と並び替えをする");
		$("#batch-edit-entry #actions-bar-top button").attr("title","保存と並び替えをする");
		
		var TODAY = new Date();
		
		$("#actions-bar-top button").click(function(){
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


/* CMSっぽいサイドバーを追加する機能 */
/* 依存プラグイン:CMSPanel 依存ファイル:sidepanel.txt */
(function($){
    $.MTAppCMSSidebar = function(options){
        var op = $.extend({
            sp_path:        ''
        },options || {});
		
		//ブログIDの取得
		var blogId = $('#blog-id').val();
		if(blogId == undefined){
			blogId = $('input[name="blog_id"]').val();
		}
		//***ブログのロール状況の判別***//
		//カテゴリーの権限があるかどうか（されていれば1以上がセットされる）
		catflag = $('#blog-wide-menu li a span:contains("カテゴリ")').length;
		//カテゴリーの権限があり、SortCatFldがインストールされているか（されていれば1以上がセットされる）
		catsortflag = $('#blog-wide-menu li a span:contains("カテゴリの並べ替え")').length;
		//SortEntriesがインストールされているか（されていれば1以上がセットされる）
		sortentriesflag = $('#blog-wide-menu li a span:contains("ブログ記事グループ")').length;

		//MT標準のサイドバーの非表示
		$('#blog-wide-menu').empty();
		//$('#design-menu,#prefs-menu,#tools-menu').hide();

		//MTの右上のボタン類排除
		$("#menu-bar-nav").hide();
		
		//サイドバーにsidepanel.txtの内容を追加
		$("#menu").prepend('<div id="nav"></div>');
		$("#menu div#nav").css("position","relative");
				
		$.ajaxSetup({ cache: false });
		$.ajaxSetup({ ifModified: true });
		
		$.ajax({
		url: op.sp_path,
		method: "get",
		dataType: "text",
		success: function(data, dataType) {
			$("#menu div#nav").append(data);
			$("#menu div#nav ul li a").each(function(){
				temp=$(this).attr("href").replace("blogidnumber",blogId);
				$(this).attr("href",temp);
			});
			
			//カテゴリボタンと、カテゴリ並び替えボタンの表示非表示
			if(catflag < 1){
				$("#menu div#nav ul li.cat").hide();
			}
			if(catsortflag < 1){
				$("#menu div#nav ul li.catsort").hide();
			}
			if(sortentriesflag < 1){
				$("#menu div#nav ul li.group").hide();
			}
			
			//index_new.html(仮公開トップがあれば、そこへリンクする
			$.ajax({
			url: "/index_new.html",
			method: "get",
			dataType: "text",
			success: function(data, dataType) {
				$("#menu div#nav ul li.viewsite a").attr("href","/index_new.html");
				$('#view-site a').attr("href","/index_new.html");
			}
			});
			
			//rollover　rollover.jsから引用
			$("#menu #nav a img").each(function(){
				var imgSrc = $(this).attr('src');
				//smartRollover
				if(imgSrc.match(/(.*)_off(\..*)/)){
					var repSrc = RegExp.$1+'_on'+RegExp.$2;
					$('<img />').attr('src',repSrc);
					$(this).hover(function(){
						$(this).attr('src',repSrc);
						$(this).css({opacity: '1',filter: 'alpha(opacity=100)'});
					},function(){
						$(this).attr('src',imgSrc);
					});
				//ロールオーバーが無い場合は、透明度80%
				}else if(!$(this).hasClass('not')){
					$(this).hover(function(){
							$(this).css({
								opacity: '0.8',
								filter: 'alpha(opacity=80)'
							});
					},function(){
							$(this).css({
								opacity: '1.0',
								filter: 'alpha(opacity=100)'
							});
					}
					
					);
				}
			});
	
		}
		});

	}
})(jQuery);


 //MTAppjQueryPlusの書き換え。

 (function($){
    $.fn.MTAppTableConverter = function(options){
        var op = $.extend({colcnt  : 2},options || {}); // optionsに値があれば上書きする

		//***初期設定***//
		//適用する箇所（Firebugで調べておく）
		var customfield = $(this);
		
		//列数
		var colcnt = op.colcnt;
		
		//テーブルの基本HTML　テーブル+行の追加ボタン
		var basehtml = '<table class="listing view MTAppTableConverter" style="table-layout:fixed;width:100%;margin:0px 0 0 0;border-spacing:2px;" cellspacing="2"></table><br /><input type="button" class="add" value="行を追加する" />';
		
		//削除ボタンのhtml
		var removebtn = '<td style="text-align:center;width:50px;"><input type="button" class="remove" value="-" /></td></tr>';
				
	//***初回実行（ページを開いたとき）テキストエリアからテーブル生成***//
		//元のテキストエリアを隠す
		customfield.css("display","none");
		//基本的なHTMLをまず入れる。
		customfield.after(basehtml);
		var rowdata = customfield.text().replace(/[\n\r][\n\r]?/g, "\n").split("\n");
		//処理対象テーブルの指定（基本変更不要）
		var tbl = customfield.parent().find("table");
		var target = customfield.parent();
		
		//投稿画面表示時に、テキストエリア→テーブルに変換する
		for(rowcnt=0;rowcnt<rowdata.length;rowcnt++)
		{
			if(rowdata[rowcnt] != ""){

			coldata = rowdata[rowcnt].split('##');
			rowbuff = "<tr>";
			if(coldata.length > 0){
				for(colcnt=0;colcnt<coldata.length;colcnt++){
					coldata[colcnt] = coldata[colcnt].replace(/<br \/>/g, "\n");

					if(op.type == "text"){
						rowbuff+= '<td><input type="text" value="'+ coldata[colcnt] +'" />';
					}
					else{
						rowbuff+= '<td><textarea class="full-width">'+ coldata[colcnt] +'</textarea>';
					}
					
				}
				rowbuff+= removebtn;
				tbl.append(rowbuff);
			}
			}
		}
		//テーブルの行の入れ替えを実装
		$("tbody",tbl).sortable();
		//行の入れ替えが伝わるように、マウスポインタを変更
		$("tbody",tbl).css("cursor","pointer");
	
	
	//***ブログ記事保存時に、テーブル→テキストエリアにデータを書き出す***//
	$("form#entry_form").submit(function(){
		op.rowbuff = "";
		
		$("tr",tbl).each(function(){
			if(op.type == "text"){
				$("input",this).each(function(){
					if($(this).val() != "-"){
					op.rowbuff += $(this).val() + "##";
					//op.rowbuff += $(this).val().replace(/[\n\r][\n\r]?/g, "\n").replace(/\n/g, "<br />") + "##";
					}
				});
			}
			else{
				$("textarea",this).each(function(){
					if($(this).val() != "-"){
					op.rowbuff += $(this).val().replace(/\n/g, "<br />") + "##";
					//op.rowbuff += $(this).val().replace(/[\n\r][\n\r]?/g, "\n").replace(/\n/g, "<br />") + "##";
					}
				});
			}

			//op.rowbuff = op.rowbuff.slice(0,-2) + "\n";
			op.rowbuff = op.rowbuff.slice(0,-2) + "\n";
			
		});
		
		customfield.val(op.rowbuff);
	});
	
	//***行の削除処理***//
	$("input.remove").live('click', function() {
		$(this).parent().parent().remove();
	});
	
	//***行の追加処理***//
	$("input.add",target).click(function(){
		tbl = $(this).parent().find("table");

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
    $.fn.MTAppCalenderSelector = function(options){
        var op = $.extend({
            colcnt  : 0,
            rowbuff  : 0,
            descend : function descend (a,b){ return b-a; }
        
        },options || {}); // optionsに値があれば上書きする

        var self = $(this);
        var n = 0,
            hMax,
            hList = new Array(),
            hListLine = new Array();
            hListLine[n] = 0;


		//***初期設定***//
		//適用する箇所（Firebugで調べておく）
		customfield = $(this);

		//元のテキストエリアを隠す
		customfield.css("display","none");

		if($('body').is("#edit-entry")){
			/* 対象となるフィールド指定 */
			//customfield = $("#customfield_calender_option1");
			
			/* 公開日からカレンダーの情報をロード */
			/* field_buff = カレンダーで選択した日付のバッファ */
			field_buff = customfield.val().split(",");
			/* date_buff = 公開日のバッファ */
			date_buff = $("#created-on").val().split("-");
			/* 日付からゼロを取り除く */
			var rep = new RegExp("^0+0?");
			//date_buff[1] =date_buff[1].replace(rep,"");
			
			/* カレンダー表示設定(jquery.calendar-min.jsを使用) */
			customfield.parent().calendar({
				caption: '%Y-%m',
				year: date_buff[0],
				month: Number(date_buff[1]),
				addDay: function(td) {
					if ($.inArray(td.text(), field_buff) == -1) {
						td.html('<a href="return false;">' + this.day + '</a>');
					}
					else{
						td.html('<a href="return false;" class="selected">' + this.day + '</a>');
					}
					td.children().click(function(){
						$(this).toggleClass("selected");
						return false;
					});
				},
				beforeMove: function(option,yearmonth) {
					/* 月が変わったら、データをクリア */
					customfield.val("");
					field_buff = "";
				}
			});
			
			//***ブログ記事保存時に、カレンダーで選択した日を書き出す***//
			$("form#entry_form").submit(function(){
				$("#main-content-inner table.calendar").each(function(){
					rowbuff = "";
					
					/* 選択状態ものをリスト化 */
					$("a.selected",this).each(function(){
						rowbuff += $(this).text() + ",";
					});
					rowbuff = rowbuff.slice(0,-1);
					
					alert($(this).parent().parent().parent().parent().find("input").length);
					
					if($(this).parent().parent().parent().parent().find("input").length > 0){
					$(this).parent().parent().parent().parent().find("input").val(rowbuff);
					}
					else{
					$(this).parent().parent().parent().parent().find("textarea").val(rowbuff);
					}
					
					/* カレンダーのキャプション+日付で公開日に現在の月を保持する */
					if(customfield.val() != ""){
					$("#created-on").val($("div.caption",$(this).parent()).text() + "-01");
					}
				});
			});	
		}
		
	}

})(jQuery);