# MTAppjQueryPlusドキュメント

## はじめに

MTAppjQuerPlusは、「[MTAppjQueryプラグイン](http://www.tinybeans.net/blog/download/mt-plugin/mtapp-jquery.html)」を元に独自に拡張をしたjQueryプラグイン集です。  
MovableTypeをCMSとして運用する際の使い勝手の向上を目的としています。


## 動作環境

+ MovableType 5.0以降
+ MTAppjQuery最新版がインストールされた環境(単体では動作しません)
+ [Splitプラグイン](http://www.koikikukan.com/archives/2009/01/20-015555.php)がインストールされた環境


## インストール

1. 「[MTAppjQueryプラグイン](http://www.tinybeans.net/blog/download/mt-plugin/mtapp-jquery.html)」をインストールします
2. mt ディレクトリ直下の mt-static/plugins ディレクトリに MTAppjQueryPlus をアップロードします。
3. user.jsの先頭に以下の記述を追加します

MTのインストールパスが/mtの例）

	document.write('<script src="/mt/mt-static/plugins/MTAppjQueryPlus/jquery-ui-1.7.3.custom.min.js" type="text/javascript"></script> ');
	document.write('<script src="/mt/mt-static/plugins/MTAppjQueryPlus/MTAppjQueryPlus.js" type="text/javascript"></script> ');


## 概要

MTAppjQueryPlusは以下の6つの機能で構成されています。

+ ブログ記事アイテムの並び替え機能  
	$.MTAppEntryAssetsSort
+ ファイルのアップロード時のファイル名のバリデート  
	$.MTAppUploadValidater
+ ブログ記事の並び替え機能  
	$.MTAppEntrySort
+ 増減可能なカスタムフィールド  
	$.fn.MTAppTableConverter
+ 複数選択可能なカレンダーカスタムフィールド  
	$.fn.MTAppCalenderSelector
+ 自在にレイアウト可能なカスタムフィールド  
	$.fn.MTAppMultiConverter


## 使用方法

user.jsに以下の記述をすることで、使用することが可能です。
必要に応じて、適用する画面をif等で分岐してください。

+ ブログ記事アイテムの並び替え機能 
	$.MTAppEntryAssetsSort();
+ ファイルのアップロード時のファイル名のバリデート  
	$.MTAppUploadValidater();
+ ブログ記事の並び替え機能  
	$.MTAppEntrySort();
+ 増減可能なカスタムフィールド  
	$("#excerpt,#customfield_xxx").MTAppTableConverter({  
		colcnt:2, //列数  
		type:'text/textarea',  
		thead:'<tr><th>項目</th><th>内容</th><th style="width:3em;"></th></tr>'  
	});
+ 複数選択可能なカレンダーカスタムフィールド  
	$("#excerpt,#customfield_xxx").MTAppCalenderSelector();
+ 自由にレイアウト可能なカスタムフィールド


## 注意事項

+ $.MTAppTableConverterは、複数行のテキストエリアに対してのみ使用可能です


## $.MTAppTableConverterの出力方法

$.MTAppTableConverterを使用した場合、1つのカスタムフィールドに「##」を
区切り文字として増減したフィールド全ての内容が格納されています。

このプラグインの特別なタグはありませんので、対象となる要素を
Splitプラグインで分割し、MTLoopを使用して以下のように出力します。

テーブル形式で出力する例）

	<table>
	<mt:ignore>/* 対象とするフィールド名の指定 */</mt:ignore>
	<mt:entryexcerpt split="\n" setvar="rowarray">
	<mt:loop name="rowarray">
	<tr>
	<mt:var name="__counter__" setvar="rowcounter">	
		<mt:var name="__value__" split="##" setvar="colarray">
		<mt:loop name="colarray">
		<mt:var name="__counter__" setvar="colcounter">
			<mt:ignore>** テーブルのセルの出力部分、条件に応じてclass等の指定 **</mt:ignore>
				<mt:if name="colcounter" eq="1">
				<th><mt:var name="__value__"></th>
				<mt:else>
				<td><mt:var name="__value__"></td>
				</mt:if>
			<mt:ignore>** テーブルのセルの出力部分、ここまで **</mt:ignore>
		</mt:loop>
	</tr>
	</mt:loop>
	</table>

## $.MTAppEntryAssetsSortの画像の取り出し方

$.MTAppEntryAssetsSortを使用した場合、MT標準のフィールド「タグ」に
画像の順番が「##」を区切り文字として格納されます。

このプラグインの特別なタグはありませんので、対象となる要素を
Splitプラグインで分割し、以下のように出力します。

共通）

	<MTSetvarTemplate name="setAssetId">
	<MTRemoveBlank>
	<mt:ignore>assetid初期化</mt:ignore>
	<mt:loop name="array">
	<mt:var name="__counter__" setvar="tmpcnt">
	<mt:setvarblock name="idtmp">assetid<mt:var name="tmpcnt"></mt:setvarblock>
	<mt:setvar name="$idtmp" value="">
	</mt:loop>
	<MTsetVar name="tagvalue" value="">
	<MTsetVar name="array" value="">

	<MTEntryTags glue=""><mt:taglabel setvar="tagvalue"></MTEntryTags>

	<mt:var name="tagvalue" split="##" setvar="array">
	<mt:loop name="array">
	<mt:var name="__value__" setvar="valuepar">
	<mt:var name="__counter__" setvar="tmpcnt">

	<mt:setvarblock name="idtmp">assetid<mt:var name="tmpcnt"></mt:setvarblock>
	<mt:setvar name="$idtmp" value="$valuepar">
	</mt:loop>

	<mt:ignore>画像を選択後、画像を消したとき時に、empty-asset-listが入ってしまうのでクリア</mt:ignore>
	<mt:if name="assetid1" eq="empty-asset-list">
	<mt:setvar name="assetid1" value="">
	</mt:if>
	</MTRemoveBlank>
	</MTSetvarTemplate>

1枚ずつ取り出す場合）

	<mt:var name="setAssetId">
	<MTAsset id="$assetid1">
	<div>
	<MTInclude module="画像表示" width="" height="">
	</div>
	</MTAsset>


全て出力する場合）

	<mt:var name="setAssetId">
	<MTIf name="assetid1">
	<ul>
	<mt:loop name="array">
	<mt:var name="__value__" setvar="valuepar">
	<mt:var name="__counter__" setvar="tmpcnt">
	<MTAsset id="$valuepar"><li<mt:if name="__counter__" op="%" value="4" eq="0"> class="last"</mt:if>><MTInclude module="画像表示" width="" height="" square="1"></li></MTAsset>
	</mt:loop>
	</ul>
	</MTIf>