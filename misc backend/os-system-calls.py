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
	if num_args == 2: # this file and param file
		try:
			compile_process = subprocess.Popen(['gcc', sys.argv[1]], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			out, err = compile_process.communicate()
			# print 'hello!'
			# print err
			# print 'goodbye!'
			if not err == "":
				raise Exception
			output_data['compile_message'] = 'program compiled successfully!'

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
				output_data['standard_out'] = 'run problem' # something wrong with running the command
		except Exception as e: 
			output_data['compile_message'] = 'compile problem' # currently both gcc not found errors and actual compile errors both end here, need to change later

	elif num_args == 3: # this file and 2 param files
		try:
			sp = subprocess.Popen(['gcc', sys.argv[1], sys.argv[2]], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			sp.wait(timeout=10)
			output_data['compile_message'] = 'program compiled successfully!'

			# compile_process = subprocess.Popen(['gcc', sys.argv[1], sys.argv[2]], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			# out, err = compile_process.communicate()
			# if not err == "": this isn't working as of now, b/c warnings also raise exceptions, need to find solution
			# 	raise Exception
			# output_data['compile_message'] = 'program compiled successfully!'

			try:
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

	with open('data.txt', 'w') as outfile:
		json.dump(output_data, outfile)