import os
import sys
import subprocess
import json
	
	
if __name__ == "__main__":
	num_args = len(sys.argv)
	command = "./a.out"
	output_data = {}
	output_data['standard_out'] = ''
	output_data['standard_error'] = ''
	if num_args == 2: # this file and param file
		try:
			subprocess.Popen(['gcc', sys.argv[1]])
			output_data['compile_message'] = 'program compiled successfully!'
			try:
				sp = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				out, err = sp.communicate()
				output_data['standard_out'] = out
				output_data['standard_error'] = err
			except (OSError, ValueError) as e:
				output_data['standard_out'] = 'program failed to run'
		except (OSError, ValueError) as e: 
			output_data['compile_message'] = 'compilation failed'

	elif num_args == 3: # this file and 2 param files
		try:
			subprocess.Popen(['gcc', sys.argv[1], sys.argv[2]])
			output_data['compile_message'] = 'program compiled successfully!'
			try:
				sp = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				out, err = sp.communicate()
				output_data['standard_out'] = out
				output_data['standard_error'] = err
			except (OSError, ValueError) as e:
				output_data['standard_out'] = 'program failed to run'
		except (OSError, ValueError) as e: 
			output_data['compile_message'] = 'compilation failed'

	else:
		output_data['compile_message'] = 'not compiled. too many params'

	with open('data.txt', 'w') as outfile:
		json.dump(output_data, outfile)