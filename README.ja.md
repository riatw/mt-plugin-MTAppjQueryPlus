# MTAppjQueryPlus �h�L�������g

## �͂��߂�

MTAppjQuerPlus�́A�uMTAppjQuery�v���O�C���v�����ɓƎ��Ɋg��������jQuery�v���O�C���W�ł��B
MovableType��CMS�Ƃ��ĉ^�p����ۂ̎g������̌����ړI�Ƃ��Ă��܂��B


## �����

+MovableType 5.0�ȍ~
+MTAppjQuery�ŐV�ł��C���X�g�[�����ꂽ��(�P�̂ł͓��삵�܂���)
+Split�v���O�C�����C���X�g�[�����ꂽ��


## �C���X�g�[��

1.�uMTAppjQuery�v���O�C���v���C���X�g�[�����܂�
2. mt �f�B���N�g�������� mt-static/plugins �f�B���N�g���� MTAppjQueryPlus ���A�b�v���[�h���܂��B
3. user.js�̐擪�Ɉȉ��̋L�q��ǉ����܂�
�@document.write('<script src="/mt/mt-static/plugins/MTAppjQueryPlus/jquery-ui-1.7.3.custom.min.js" type="text/javascript"></script> ');
�@document.write('<script src="/mt/mt-static/plugins/MTAppjQueryPlus/MTAppjQueryPlus.js" type="text/javascript"></script> ');


## �T�v

MTAppjQueryPlus�͈ȉ���6�̋@�\�ō\������Ă��܂��B
�E�u���O�L���A�C�e���̕��ёւ��@�\
	$.MTAppEntryAssetsSort
�E�t�@�C���̃A�b�v���[�h���̃t�@�C�����̃o���f�[�g
	$.MTAppUploadValidater
�E�u���O�L���̕��ёւ��@�\
	$.MTAppEntrySort
�E�����\�ȃJ�X�^���t�B�[���h
	$.fn.MTAppTableConverter
�E�����I���\�ȃJ�����_�[�J�X�^���t�B�[���h
	$.fn.MTAppCalenderSelector
�E���݂Ƀ��C�A�E�g�\�ȃJ�X�^���t�B�[���h
	$.fn.MTAppMultiConverter


## �g�p���@

user.js�Ɉȉ��̋L�q�����邱�ƂŁA�g�p���邱�Ƃ��\�ł��B
�K�v�ɉ����āA�K�p�����ʂ�if���ŕ��򂵂Ă��������B

�E�u���O�L���A�C�e���̕��ёւ��@�\
	$.MTAppEntryAssetsSort();
�E�t�@�C���̃A�b�v���[�h���̃t�@�C�����̃o���f�[�g
	$.MTAppUploadValidater();
�E�u���O�L���̕��ёւ��@�\
	$.MTAppEntrySort();
�E�����\�ȃJ�X�^���t�B�[���h
	$("#excerpt,#customfield_xxx").MTAppTableConverter({
		colcnt:2, //��
		type:'textarea',	//text=�P��s textarea=�����s
		thead:'<tr><th>����</th><th>���e</th><th style="width:3em;"></th></tr>'
		//thead=���o��
	});
�E�����I���\�ȃJ�����_�[�J�X�^���t�B�[���h
	$("#excerpt,#customfield_xxx").MTAppCalenderSelector();
�E���R�Ƀ��C�A�E�g�\�ȃJ�X�^���t�B�[���h


##���ӎ���

�E$.MTAppTableConverter�́A�����s�̃e�L�X�g�G���A�ɑ΂��Ă̂ݎg�p�\�ł�


##$.MTAppTableConverter�̏o�͕��@

$.MTAppTableConverter���g�p�����ꍇ�A1�̃J�X�^���t�B�[���h�Ɂu##�v��
��؂蕶���Ƃ��đ��������t�B�[���h�S�Ă̓��e���i�[����Ă��܂��B

���̃v���O�C���̓��ʂȃ^�O�͂���܂���̂ŁA�ΏۂƂȂ�v�f��
Split�v���O�C���ŕ������AMTLoop���g�p���Ĉȉ��̂悤�ɏo�͂��܂��B

�e�[�u���`���ŏo�͂����j
<table>
<mt:ignore>/* �ΏۂƂ���t�B�[���h���̎w�� */</mt:ignore>
<mt:entryexcerpt split="\n" setvar="rowarray">
<mt:loop name="rowarray">
<tr>
<mt:var name="__counter__" setvar="rowcounter">	
	<mt:var name="__value__" split="##" setvar="colarray">
	<mt:loop name="colarray">
	<mt:var name="__counter__" setvar="colcounter">
		<mt:ignore>** �e�[�u���̃Z���̏o�͕����A�����ɉ�����class���̎w�� **</mt:ignore>
			<mt:if name="colcounter" eq="1">
			<th><mt:var name="__value__"></th>
			<mt:else>
			<td><mt:var name="__value__"></td>
			</mt:if>
		<mt:ignore>** �e�[�u���̃Z���̏o�͕����A�����܂� **</mt:ignore>
	</mt:loop>
</tr>
</mt:loop>
</table>

##$.MTAppEntryAssetsSort�̉摜�̎��o����

$.MTAppEntryAssetsSort���g�p�����ꍇ�AMT�W���̃t�B�[���h�u�^�O�v��
�摜�̏��Ԃ��u##�v����؂蕶���Ƃ��Ċi�[����܂��B

���̃v���O�C���̓��ʂȃ^�O�͂���܂���̂ŁA�ΏۂƂȂ�v�f��
Split�v���O�C���ŕ������A�ȉ��̂悤�ɏo�͂��܂��B

���ʁj
<MTSetvarTemplate name="setAssetId">
<MTRemoveBlank>
<mt:ignore>assetid������</mt:ignore>
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

<mt:ignore>�摜��I����A�摜���������Ƃ��H�i�����؁j���ɁAempty-asset-list�������Ă��܂����̑΍�</mt:ignore>
<mt:if name="assetid1" eq="empty-asset-list">
<mt:setvar name="assetid1" value="">
</mt:if>
</MTRemoveBlank>
</MTSetvarTemplate>

1�������o���ꍇ�j
<mt:var name="setAssetId">
<MTAsset id="$assetid1">
<div>
<MTInclude module="�摜�\��" width="" height="">
</div>
</MTAsset>


�S�ďo�͂���ꍇ�j
<mt:var name="setAssetId">
<MTIf name="assetid1">
<ul class="fancybox">
<mt:loop name="array">
<mt:var name="__value__" setvar="valuepar">
<mt:var name="__counter__" setvar="tmpcnt">
<MTAsset id="$valuepar"><li<mt:if name="__counter__" op="%" value="4" eq="0"> class="last"</mt:if>><MTInclude module="�摜�\��" width="" height="" square="1"></li></MTAsset>
</mt:loop>
</ul>
</MTIf>