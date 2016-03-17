import os
import sys
import subprocess32 as subprocess
import json
	
	
if __name__ == "__main__":
	num_args = len(sys.argv)
	command = "./a.out"
	output_data = {}
	output_data['standard_out'] = ''
	output_data['standard_error'] = ''
	output_file = sys.argv[1] + '.out'
	# params = ['gcc', '-o', output_file, sys.argv[1], sys.argv[2]]
	# sp = subprocess.Popen(params)
	# sp.communicate()
	if num_args == 3: # this file and param file
		try:
			#
			# First attempt to compile
			#
			compile_process = subprocess.Popen(['gcc', sys.argv[1]], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			out, err = compile_process.communicate()
			rc = compile_process.returncode
			print 'return code is: ' + str(rc)
			if not rc == 0:
				raise Exception
			output_data['compile_message'] = 'program compiled successfully!'

			# Then attempt to run
			try:
				sp = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				try:
					out, err = sp.communicate()
					output_data['standard_out'] = out
					output_data['standard_error'] = err
				except TimeoutExpired:
					sp.kill()
					out, err = sp.communicate()
					output_data['standard_out'] = out
					output_data['standard_error'] = err
			except Exception as e:
				output_data['standard_out'] = 'run problem'
		except Exception as e: 
			output_data['compile_message'] = 'compile problem'

	elif num_args == 4: # this file and 2 param files
		try:
			#
			# First attempt to compile
			#
			args = ['gcc', '-o', output_file, sys.argv[1], sys.argv[2]]
			compile_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			out, err = compile_process.communicate()
			rc = compile_process.returncode
			print 'return code is: ' + str(rc)
			if not rc == 0:
				raise Exception
			output_data['compile_message'] = 'program compiled successfully!'

			# Then attempt to run
			try:
				command = './' + output_file
				sp = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				try:
					out, err = sp.communicate()
					output_data['standard_out'] = out
					output_data['standard_error'] = err
				except subprocess.TimeoutExpired:
					sp.kill()
					out, err = sp.communicate()
					output_data['standard_out'] = out
					output_data['standard_error'] = err
			except Exception as e:
				output_data['standard_out'] = 'run problem'
		except Exception as e: 
			output_data['compile_message'] = 'compile problem'

	else:
		output_data['compile_message'] = 'not compiled. too many params'

	rc = os.remove(output_file)
	print 'remove rc: ' + str(rc)
	with open('data.txt', 'w') as outfile:
		json.dump(output_data, outfile)
	# a+rwx
	os.chmod('data.txt', 0777)