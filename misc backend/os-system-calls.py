import os
import sys
import subprocess
import json

class Compiler:

	def __init__(self, args):
		self.output_data = {}
		self.output_data.setdefault('standard_out', '')
		self.output_data.setdefault('standard_error', '')
		self.args = args
		self.output_file = args[1] + '.out'
		self.is_executable_there = True

	def compile(self):
		if len(self.args) == 3:
			try:
				args = ['gcc', '-o', self.output_file, self.args[1], self.args[2]]
				compile_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				out, err = compile_process.communicate()
				rc = compile_process.returncode
				print 'return code is: ' + str(rc)
				if rc != 0:
					raise Exception
				self.output_data['compile_message'] = 'program compiled successfully!'
			except Exception as e:
				self.output_data['compile_message'] = 'There was a compilation problem.'
				print e
		elif len(self.args) == 4:
			try:
				args = ['gcc', '-o', self.output_file, self.args[1], self.args[2]]
				compile_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				out, err = compile_process.communicate()
				rc = compile_process.returncode
				print 'return code is: ' + str(rc)
				if rc != 0:
					raise Exception
				self.output_data['compile_message'] = 'Program compiled successfully!'
			except Exception as e:
				self.output_data['compile_message'] = 'There was a compilation problem.'
				print e
		else:
			self.output_data['compile_message'] = 'Incorrect number of input parameters.'

	def run(self):
		try:
			command = './' + self.output_file
			sp = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			self.is_executable_there = True
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
			print 'hello'
			self.is_executable_there = False
			self.output_data['standard_out'] = 'Run problem. Maybe the file did not compile?'

	def clean(self):
		if self.is_executable_there:
			os.remove(self.output_file)
		self.output_file = self.args[1] + '.txt'
		with open(self.output_file, 'w') as outfile:
			json.dump(self.output_data, outfile)
		# a+rwx
		os.chmod(self.output_file, 0777)
	

if __name__ == "__main__":
	os.putenv("TMPDIR", "/tmp")
	compiler = Compiler(sys.argv)
	compiler.compile()
	compiler.run()
	compiler.clean()