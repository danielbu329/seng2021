#!/usr/bin/perl -w

while ($line = <STDIN>) {
	$line =~ /<option value.*>(.*)<\/option>/, $line;
	print "$1\n";
}
