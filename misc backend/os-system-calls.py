import os
import sys
import subprocess
import json

class Compiler:

	def __init__(self, student_file):
		self.output_data = {}
		self.output_data.setdefault('standard_out', '')
		self.output_data.setdefault('standard_error', '')
		self.output_file = student_file + '.out'

	def compile(self, args=None):
		if len(args) == 3:
			try:
				args = ['gcc', '-o', output_file, args[1], args[2]]
				compile_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				out, err = compile_process.communicate()
				rc = compile_process.returncode
				print 'return code is: ' + str(rc)
				if rc != 0:
					raise Exception
				output_data['compile_message'] = 'program compiled successfully!'
			except Exception as e:
				self.output_data['compile_message'] = 'There was a compilation problem.'
				print e
		elif len(args) == 4:
			try:
				args = ['gcc', '-o', output_file, args[1], args[2]]
				compile_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				out, err = compile_process.communicate()
				rc = compile_process.returncode
				print 'return code is: ' + str(rc)
				if rc != 0:
					raise Exception
				output_data['compile_message'] = 'Program compiled successfully!'
			except Exception as e:
				self.output_data['compile_message'] = 'There was a compilation problem.'
				print e
		else:
			self.output_data['compile_message'] = 'Incorrect number of input parameters.'

	def run(self):
		try:
			command = './' + output_file
			sp = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			try:
				out, err = sp.communicate()
				self.output_data['standard_out'] = out
				self.output_data['standard_error'] = err
			except subprocess.TimeoutExpired:
				sp.kill()
				out, err = sp.communicate()
				self.output_data['standard_out'] = out
				self.output_data['standard_error'] = err
		except Exception as e:
			self.output_data['standard_out'] = 'Run problem. Maybe the file did not compile?'

	def clean(self):
		rc = os.remove(self.output_file)
		print 'remove rc: ' + str(rc)
		self.output_file = sys.argv[1] + '.txt'
		with open(self.output_file, 'w') as outfile:
			json.dump(output_data, outfile)
		# a+rwx
		os.chmod(self.output_file, 0777)
	
if __name__ == "__main__":
	os.putenv("TMPDIR", "/tmp")
	compiler = Compiler(sys.argv[1])
	compiler.compile(sys.argv)
	compiler.run()
	compiler.clean()