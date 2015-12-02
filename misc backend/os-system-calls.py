import os

if (os.name == 'nt'):
	os.system("C:\\Users\\Michael\\Desktop\\tools\\PuTTy.lnk")
	print 'windows'
elif (os.name == 'posix'):
	os.system("")
else:
	print 'os not supported'
