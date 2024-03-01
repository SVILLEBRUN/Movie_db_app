Set-Location D:\Film
$data = Get-ChildItem D:\Film | Where-Object {$_.PSIsContainer} | Select-Object Name | ConvertTo-Json -Compress
$result = @{ "names" = (ConvertFrom-Json $data).Name }
$result | ConvertTo-Json -Compress | Set-Content -Path "C:\Users\sebas\Developpements\Local_Scripts\movie_titles.json"
