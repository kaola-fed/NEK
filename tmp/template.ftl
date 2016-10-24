<@compress>
<!DOCTYPE html>
<html>
<head>
	<title>{{title}}</title>
    <#include  "../wrapper/import.ftl">
    <#include "/common/macro.ftl">
	<meta charset="utf-8"/>

    <@basecss/>
	<style></style>
</head>
<body>
    <@topHeader />
<div class="g-body f-clearfix">
	<div class="g-bd">
		<div class="g-bdc">
			<div class="m-main">
				<div id="app"></div>
			</div>
		</div>
	</div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<script src="${nejRoot}"></script>
<script>
	NEJ.define([
		'pro/page/{{pageName}}/entry'
	],function(m){
		m._$$Module._$allocate();
	});
</script>
</body>
</html>
</@compress>