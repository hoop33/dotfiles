function conky_mycpus(height, width)
  local file = io.popen("grep -c processor /proc/cpuinfo")
  local num = file:read("*n")
  file:close()
  cpus = "CPU:${color3}${alignr}${cpu cpu0}%\n"
  for i = 1,num 
  do
    cpus = cpus .. " ${color2}${cpubar cpu" .. tostring(i) .. " " .. height .. "," .. width .. "}" .. ((i % 3 == 0 and i ~= num) and " \n" or "")
  end

  return cpus
end
