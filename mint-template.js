<table class='table'>
<tr>
  <th><img src="opensea.png"></th>
  <th><img src="rarible.png"></th>
</tr>
{{#each items}}
<tr>
  <td><a class='token' target="_blank" href="{{opensea}}">token #{{tokenId}}</a></td>
  <td><a class='token' target="_blank" href="{{rarible}}">token #{{tokenId}}</a></td>
</tr>
{{/each}}
</table>