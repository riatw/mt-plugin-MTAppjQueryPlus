#
# MTAppjQueryPlus.pm
# 2006/03/05 1.00 First Release
# Copyright(c) by H.Fujimoto
#

package MTAppjQueryPlus;
use base qw(MT::App);
use strict;

use MT;
use JSON;
use Data::Dumper;

sub init
{
    my $app = shift;
    $app->SUPER::init(@_) or return;
    $app->add_methods(
        status => \&status,
        initialize => \&initialize,
        ajax => \&ajax,
    );
    $app->{default_mode} = 'status';
    $app->{charset} = $app->{cfg}->PublishCharset;
    $app;
}

sub initialize
{
	my $app = shift;
	my %param;
	$param{blog_id} = $app->param('blog_id');
	$param{type} = $app->param('_type');
	return $app->load_tmpl($param{type} . '_initialize_view.tmpl', \%param);
}

sub ajax
{
	my $app = shift;
	my %param;
	$param{blog_id} = $app->param('blog_id');
	$param{type} = $app->param('_type');
	$param{offset} = $app->param('offset');
	$param{lastn} = $app->param('lastn');
	return $app->load_tmpl($param{type} . '_ajax_view.tmpl', \%param);
}

sub status
{
	my $str = '{"test1":"aaa","test2":"bbb"}';
	return Dumper decode_json($str);
}

1;
