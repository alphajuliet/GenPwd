#!/usr/bin/env rake
require 'SyncFTP'

desc "Sync app to FTP site"
task :upload do
  username = ENV[ 'FTPUSER' ]
  password = ENV[ 'FTPPASS' ]
	ftp = SyncFTP.new('ftp.alphajuliet.com', :username => username, :password => password)
	ftp.sync(:local => 'build', :remote => '/public_html/lab')
end


# The End
