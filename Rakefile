#!/usr/bin/env rake
require 'SyncFTP'

desc "Sync app to FTP site"
task :upload do
	ftp = SyncFTP.new('ftp.alphajuliet.com', :username => 'andrewj', :password => '')
	ftp.sync(:local => 'build', :remote => '/public_html/lab')
end


# The End
