import os
import sys
	
	
	
if __name__ == "__main__":
	num_args = len(sys.argv)
	if num_args == 2: # this file and param file
		if (os.name == 'nt'):
			os.system("echo hi")
			print 'windows'
		elif (os.name == 'posix'):
			os.system("gcc " + sys.argv[1])
			os.system("./a.out")
		else:
			print 'os not supported'
	elif num_args == 3: # this file and 2 param files
		if (os.name == 'nt'):
			os.system("echo hello")
			print 'windows'
		elif (os.name == 'posix'):
			os.system("gcc " + sys.argv[1] + " " + sys.argv[2])
			os.system("./a.out")
		else:
			print 'os not supported'
	else:
		print 'too many file params'